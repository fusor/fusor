#
# Copyright 2015 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

require "net/http"
require "sys/filesystem"
require "uri"

module Fusor
  class Api::V3::DeploymentsController < Api::V3::BaseController

    #include Api::Version3

    before_filter :find_deployment, :only => [:destroy, :show, :update,
                                              :deploy, :redeploy, :validate, :log, :openshift_disk_space]

    rescue_from Encoding::UndefinedConversionError, :with => :ignore_it

    def index
      @deployments = Deployment.includes(:organization, :lifecycle_environment, :discovered_host,
                                         :discovered_hosts, :ose_master_hosts, :ose_worker_hosts, :subscriptions,
                                         :introspection_tasks, :foreman_task, :openstack_deployment)
                                .search_for(params[:search], :order => params[:order]).by_id(params[:id])
      render :json => @deployments, :include => :organization, :each_serializer => Fusor::DeploymentSerializer
    end

    def show
      render :json => @deployment, :serializer => Fusor::DeploymentSerializer
    end

    def create
      @deployment = Deployment.new(deployment_params)
      if @deployment.save
        render :json => @deployment, :serializer => Fusor::DeploymentSerializer
      else
        render json: {errors: @deployment.errors}, status: 422
      end
    end

    def update
      @deployment.attributes = deployment_params
      @deployment.save(:validate => false)
      render :json => @deployment, :serializer => Fusor::DeploymentSerializer
    end

    def destroy
      @deployment.destroy
      respond_for_show :resource => @deployment
    end

    def deploy
      begin
        # If we're deploying then the deployment object needs to be valid.
        # This should be the only time we run the DeploymentValidator.
        if @deployment.invalid?
          raise ::ActiveRecord::RecordInvalid.new @deployment
        end

        ::Fusor.log_change_deployment(@deployment)

        # update the provider with the url
        ::Fusor.log.debug "setting provider url to [#{@deployment.cdn_url}]"
        provider = @deployment.organization.redhat_provider
        # just in case save it on the @deployment.org as well
        @deployment.organization.redhat_provider.repository_url = @deployment.cdn_url
        provider.repository_url = @deployment.cdn_url
        provider.save!

        save_deployment_attributes

        manifest_task = sync_task(::Actions::Fusor::Subscription::ManageManifest,
                                  @deployment,
                                  customer_portal_credentials)

        # If the manifest action failed, there is no need to continue with
        # the deploy actions, since it requires subscriptions & content
        # both of which are enabled by the manifest.
        unless manifest_task["result"] == "error"
          task = async_task(::Actions::Fusor::Deploy,
                            @deployment,
                            params[:skip_content])
        end
        respond_for_async :resource => task
      rescue ::ActiveRecord::RecordInvalid
        render json: {errors: @deployment.errors}, status: 422
      end
    end

    def redeploy
      begin
        if @deployment.invalid?
          raise ::ActiveRecord::RecordInvalid.new @deployment
        end
        ::Fusor.log.warn "Attempting to redeploy deployment with id [ #{@deployment.id} ]"
        new_deploy_task = async_task(::Actions::Fusor::Deploy, @deployment)
        respond_for_async :resource => new_deploy_task
      rescue ::ActiveRecord::RecordInvalid
        render json: {errors: @deployment.errors}, status: 422
      end
    end

    def validate
      @deployment.valid?
      error_messages = @deployment.errors.full_messages
      error_messages += @deployment.openstack_deployment.errors.full_messages if @deployment.deploy_openstack?
      render json: {
        :validation => {
          :deployment_id => @deployment.id,
          :errors => error_messages,
          :warnings => @deployment.warnings
        }
      }
    end

    def validate_cdn
      begin
        if params.key?('cdn_url')
          ad_hoc_req = lambda do |uri_str|
            uri = URI.parse(uri_str)
            http = Net::HTTP.new(uri.host, uri.port)
            request = Net::HTTP::Head.new(uri.request_uri)
            http.request(request)
          end

          unescaped_uri_str = URI.unescape(params[:cdn_url])
          # Best we can reasonably do here is to check to make sure we get
          # back a 200 when we hit $URL/content, since we can be reasonably
          # certain a repo needs to have the /content path
          full_uri_str = "#{unescaped_uri_str}/content"
          full_uri_str = "#{unescaped_uri_str}content" if unescaped_uri_str =~ /\/$/

          response = ad_hoc_req.call(full_uri_str)
          # Follow a 301 once in case redirect /content -> /content/
          final_code = response.code
          final_code = ad_hoc_req.call(response['location']).code if response.code == '301'

          render json: { :cdn_url_code => final_code }, status: 200
        else
          raise 'cdn_url parameter missing'
        end
      rescue => error
        message = 'Malformed request'
        message = error.message if error.respond_to?(:message)
        render json: { :error => message }, status: 400
      end
    end

    def log
      log_type_param = params[:log_type] || 'fusor_log'
      reader = create_log_reader(log_type_param)
      log_path = get_log_path(log_type_param)

      if !File.exist? log_path
        render :json => {log_type_param => nil}
      elsif params[:line_number_gt]
        render :json => {log_type_param => reader.tail_log_since(log_path, (params[:line_number_gt]).to_i)}
      else
        render :json => {log_type_param => reader.read_full_log(log_path)}
      end
    end

    def openshift_disk_space
      # Openshift deployments need to know how much disk space is available on the NFS storage pool
      # This method mounts the specifed NFS share and gets the available disk space
      begin
        nfs_address = @deployment.rhev_storage_address
        nfs_path = @deployment.rhev_share_path
        deployment_id = @deployment.id

        cmd = "sudo safe-mount.sh '#{deployment_id}' '#{nfs_address}' '#{nfs_path}'"
        status, _output = Utils::Fusor::CommandUtils.run_command(cmd)

        raise 'Unable to mount NFS share at specified mount point' unless status == 0

        stats = Sys::Filesystem.stat("/tmp/fusor-test-mount-#{deployment_id}")
        mb_available = stats.block_size * stats.blocks_available / 1024 / 1024

        Utils::Fusor::CommandUtils.run_command("sudo safe-umount.sh #{deployment_id}")
        render json: { :openshift_disk_space => mb_available }, status: 200
      rescue Exception => error
        message = 'Unable to retrieve Openshift disk space'
        message = error.message if error.respond_to?(:message)

        render json: { :error => message}, status: 500
      end
    end

    def resource_name
      'deployment'
    end

    private

    def deployment_params
      params.require(:deployment).permit(:name, :description, :deploy_rhev, :deploy_cfme,
                                         :deploy_openstack, :deploy_openshift, :is_disconnected, :rhev_is_self_hosted,
                                         :rhev_engine_admin_password, :rhev_data_center_name,
                                         :rhev_cluster_name, :rhev_storage_name, :rhev_storage_type,
                                         :rhev_storage_address, :rhev_cpu_type, :rhev_share_path,
                                         :hosted_storage_name, :hosted_storage_address, :hosted_storage_path,
                                         :cfme_install_loc, :rhev_root_password, :cfme_root_password,
                                         :cfme_admin_password, :cfme_db_password, :foreman_task_uuid,
                                         :upstream_consumer_uuid, :upstream_consumer_name, :rhev_export_domain_name,
                                         :rhev_export_domain_address, :rhev_export_domain_path,
                                         :rhev_local_storage_path, :rhev_gluster_node_name,
                                         :rhev_gluster_node_address, :rhev_gluster_ssh_port,
                                         :rhev_gluster_root_password, :host_naming_scheme, :has_content_error,
                                         :custom_preprend_name, :enable_access_insights, :cfme_address, :cfme_hostname,
                                         :openshift_install_loc, :openshift_number_master_nodes, :openshift_number_worker_nodes,
                                         :openshift_storage_size, :openshift_username, :openshift_user_password,
                                         :openshift_root_password, :openshift_master_vcpu, :openshift_master_ram,
                                         :openshift_master_disk, :openshift_node_vcpu, :openshift_node_ram, :openshift_node_disk,
                                         :openshift_available_vcpu, :openshift_available_ram, :openshift_available_disk,
                                         :openshift_storage_type, :openshift_storage_name, :openshift_storage_host,
                                         :openshift_export_path, :openshift_subdomain_name, :cloudforms_vcpu,
                                         :cloudforms_ram, :cloudforms_vm_disk_size, :cloudforms_db_disk_size,
                                         :cdn_url, :manifest_file, :created_at, :updated_at, :rhev_engine_host_id,
                                         :organization_id, :lifecycle_environment_id, :discovered_host_id,
                                         :foreman_task_id, :openstack_deployment_id, :discovered_host_ids => [])
    end

    def find_deployment
      id = params[:deployment_id] || params[:id]
      not_found and return false if id.blank?
      @deployment = Deployment.includes(:organization, :lifecycle_environment, :discovered_host, :discovered_hosts,
                                        :ose_master_hosts, :ose_worker_hosts, :subscriptions, :introspection_tasks,
                                        :foreman_task, :openstack_deployment).find(id)
    end

    def ignore_it
      true
    end

    def customer_portal_credentials
      { :username => session[:portal_username], :password => session[:portal_password] }
    end

    def save_deployment_attributes
      Fusor.log.info "====== Saving Deployment Atrributes ======"

      path = ::Fusor.log_file_dir(@deployment.label, @deployment.id)
      FileUtils.mkdir_p tmp_dir if !File.directory?(path)

      dep_text = JSON.pretty_generate(@deployment.serializable_hash)
      write_file(path, 'deployment.json', dep_text)

      if @deployment.deploy_openstack
        osp_text = JSON.pretty_generate(@deployment.openstack_deployment.serializable_hash)
        write_file(path, 'openstack.json', osp_text)
      end
    end

    def write_file(path, filename, text)
      file = "#{path}/#{filename}"
      FileUtils.rmtree(file) if File.exist?(file)
      Fusor.log.info "====== '#{file}' ====== \n #{text}"
      begin
        File.write(file, text)
      rescue
        Fusor.log.error "Failed to write file : '#{file}'!"
      end
    end

    def deployment_params

      # add belongs_to attributes: organization_id, lifecycle_environment_id, rhev_engine_host_id
      if params[:data][:relationships]
        if (org = params[:data][:relationships][:organization])
          org_id = org[:data] ? org[:data][:id] : nil
          params[:data][:attributes][:organization_id] = org_id
        end
        if (env = params[:data][:relationships][:lifecycle_environment])
          env_id = env[:data] ? env[:data][:id] : nil
          params[:data][:attributes][:lifecycle_environment_id] = env_id
        end
        if (engine = params[:data][:relationships][:discovered_host])
          engine_id = engine[:data] ? engine[:data][:id] : nil
          params[:data][:attributes][:rhev_engine_host_id] = engine_id
        end
      end

      # add discovered_host_ids => [] as permitted in addition to model attrs
      # Note: config.action_dispatch.perform_deep_munge = false, so [] is passed as [] and not null
      params.require(:data).require(:attributes).permit(:name, :lifecycle_environment_id,
              :organization_id, :deploy_rhev, :deploy_cfme, :deploy_openstack, :rhev_engine_host_id,
              :rhev_data_center_name, :rhev_cluster_name, :rhev_storage_name, :rhev_storage_type,
              :rhev_storage_address, :rhev_cpu_type, :rhev_share_path, :cfme_install_loc,
              :description, :rhev_is_self_hosted, :rhev_engine_admin_password, :foreman_task_uuid,
              :upstream_consumer_uuid, :rhev_root_password, :cfme_root_password,
              :upstream_consumer_name, :rhev_export_domain_name, :rhev_export_domain_address,
              :rhev_export_domain_path, :rhev_local_storage_path, :host_naming_scheme,
              :custom_preprend_name, :enable_access_insights, :cfme_address, :cfme_admin_password,
              :openstack_undercloud_password, :openstack_undercloud_ip_addr,
              :openstack_undercloud_user, :openstack_undercloud_user_password, :cdn_url,
              :manifest_file, :is_disconnected, :openstack_overcloud_address,
              :openstack_overcloud_password, :openstack_overcloud_private_net,
              :openstack_overcloud_float_net, :openstack_overcloud_float_gateway,
              :openstack_overcloud_hostname, :openstack_undercloud_hostname, :cfme_hostname,
              :label, :has_content_error,
              :discovered_host_ids => [])
    end

    def create_log_reader(log_type_param)
      case log_type_param
        when 'fusor_log', 'foreman_log'
          Fusor::Logging::RailsLogReader.new
        when 'candlepin_log'
          Fusor::Logging::JavaLogReader.new
        when 'foreman_proxy_log'
          Fusor::Logging::ProxyLogReader.new
        else
          Fusor::Logging::LogReader.new
      end
    end

    def get_log_path(log_type_param)
      dir = ::Fusor.log_file_dir(@deployment.label, @deployment.id)
      case log_type_param
        when 'messages_log'
          File.join(dir, 'var/log/messages')
        when 'candlepin_log'
          File.join(dir, 'var/log/candlepin/candlepin.log')
        when 'foreman_log'
          File.join(dir, 'var/log/foreman/production.log')
        when 'foreman_proxy_log'
          File.join(dir, 'var/log/foreman-proxy/proxy.log')
        else
          ::Fusor.log_file_path(@deployment.label, @deployment.id)
      end
    end
  end
end
