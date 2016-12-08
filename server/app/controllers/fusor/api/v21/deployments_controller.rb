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
require "json"
require 'fusor/password_filter'
require 'fusor/deployment_logger'

module Fusor
  class Api::V21::DeploymentsController < Api::V21::BaseController

    before_filter :find_deployment, :only => [:destroy, :show, :update, :check_mount_point,
                                              :deploy, :redeploy, :validate, :log,
                                              :openshift_disk_space, :compatible_cpu_families]

    rescue_from Encoding::UndefinedConversionError, :with => :ignore_it

    resource_description do
      desc 'Fusor deployment objects contains all the configuration options for deployment.'
      api_version 'fusor_v21'
      api_base_url '/fusor/api/v21'
    end

    def_param_group :deployment do
      param :deployment, Hash, desc: 'QCI Deployment', required: true do
        param :name, String, desc: 'Deployment name'
        param :description, String, desc: 'Deployment description'
        param :foreman_task_uuid, :identifier, desc: 'Task identifier for the main deployment task'

        param :deploy_rhev, :bool, desc: 'Will the deployment deploy Red Hat Virtualization (RHV)'
        param :deploy_cfme, :bool, desc: 'Will the deployment deploy Red Hat Cloud Forms Management Engine (CFME)'
        param :deploy_openstack, :bool, desc: 'Will the deployment deploy Red Hat OpenStack Platform (OSP)'
        param :deploy_openshift, :bool, desc: 'Will the deployment deploy OpenShift Container Platform (OCP)'

        param :organization_id, Integer, 'ID of the Organization the deployment should use'
        param :lifecycle_environment_id, Integer, 'ID of the lifecycle environment the deployment should use'

        param :enable_access_insights, :bool, desc: 'Will the deployment enable Red Hat Insights'

        param :is_disconnected, :bool, desc: 'Will the deployment use disconnected sync'
        param :rhev_is_self_hosted, :bool, desc: 'Will the RHV management engine be deployed to a hypervisor'
        param :rhev_self_hosted_engine_hostname, String, desc: "Self hosted RHV engine's hostname"
        param :host_naming_scheme, String, desc: 'Choose RHV hypervisor naming scheme (hypervisorN/Freeform/MAC Address/Custom scheme)'
        param :custom_preprend_name, String, desc: 'When using a "Custom scheme" for host naming scheme, this string will be prepended to the host ID'
        param :rhev_engine_host_id, Integer, desc: 'ID of the host where the RHV engine will be deployed'
        param :discovered_host_id, Integer, desc: 'ID of the host where the RHV engine will be deployed'

        param :rhev_root_password, String, desc: 'RHV hosts root password'
        param :rhev_engine_admin_password, String, desc: 'RHV management engine password for the admin user'
        param :rhev_data_center_name, String, desc: 'RHV data center name'
        param :rhev_cluster_name, String, desc: 'RHV cluster name'
        param :rhev_cpu_type, String, desc: 'Type of CPU for RHV installation'

        param :rhev_storage_type, String, desc: 'RHV host storage type (NFS/glusterfs) for data, export, and self hosted'

        param :rhev_storage_name, String, desc: 'RHV data storage name'
        param :rhev_storage_address, String, desc: 'RHV data storage address'
        param :rhev_share_path, String, desc: 'RHV data storage path on the server'

        param :rhev_export_domain_name, String, desc: 'RHV export domain storage name'
        param :rhev_export_domain_address, String, desc: 'RHV export domain storage address'
        param :rhev_export_domain_path, String, desc: 'RHV export domain storage path'

        param :hosted_storage_name, String, desc: 'Storage name for the self-hosted RHV engine'
        param :hosted_storage_address, String, desc: 'Storage address for the self-hosted RHV engine'
        param :hosted_storage_path, String, desc: 'Storage path for the self-hosted RHV engine'

        param :openstack_deployment_id, Integer, desc: 'ID of the OpenStack deployment object with OpenStack fields'

        param :openshift_install_loc, String, desc: 'Location where OpenShift should be installed (RHV/OSP)'
        param :openshift_number_master_nodes, Integer, desc: 'Number of OpenShift master nodes to be deployed'
        param :openshift_number_worker_nodes, Integer, desc: 'Number of OpenShift worker nodes to be deployed'

        param :openshift_available_vcpu, Integer, desc: 'vCPUs available to allocate to OpenShift Nodes'
        param :openshift_available_ram, Integer, desc: 'RAM available to allocate to OpenShift Nodes'
        param :openshift_available_disk, Integer, desc: 'Disk storage available to allocate to OpenShift Nodes'

        param :openshift_master_vcpu, Integer, desc: 'vCPUs allocated to each master node'
        param :openshift_master_ram, Integer, desc: 'RAM allocated to each master node'
        param :openshift_master_disk, Integer, desc: 'Disk storage allocated to each master node'

        param :openshift_node_vcpu, Integer, desc: 'vCPUs allocated to each worker node'
        param :openshift_node_ram, Integer, desc: 'RAM allocated to each worker node'
        param :openshift_node_disk, Integer, desc: 'Disk storage allocated to each worker node'
        param :openshift_storage_size, Integer, desc: 'Additional storage needed for Docker containers on each worker node'

        param :openshift_storage_type, String, desc: 'OpenShift export storage type (NFS/glusterfs)'
        param :openshift_storage_host, String, desc: 'OpenShift storage host'
        param :openshift_export_path, String, desc: 'OpenShift export storage path'
        param :openshift_username, String, desc: 'Username on the account that will be created and used to configure all nodes'
        param :openshift_user_password, String, desc: 'Password on the account that will be created and used to configure all nodes'
        param :openshift_subdomain_name, String, desc: 'Subdomain name for a wildcard entry to point to the OpenShift router'
        param :openshift_sample_helloworld, :bool, desc: 'Will the deployment deploy an OpenShift "Hello World" sample application'

        param :cfme_install_loc, String, desc: 'Location of the primary CloudForms appliance'
        param :cfme_root_password, String, desc: 'CloudForms password for root ssh'
        param :cfme_admin_password, String, desc: 'CloudForms admin password for the admin user'
        param :cfme_db_password, String, desc: 'CloudForms password for the database '

        param :upstream_consumer_uuid, String, desc: 'UUID of the Subscription Management Application for consumed products'
        param :upstream_consumer_name, String, desc: 'Name of the Subscription Management Application for consumed products'

        param :cdn_url, String, desc: 'CDN URL for content sync'
        param :manifest_file, String, desc: 'Subscription manifest file used for disconnected sync'

        param :has_content_error, String, desc: 'Set when the deployment has encountered a content sync error and must be redeployed'
      end
    end


    api :GET, '/deployments', 'Gets a list of deployments'
    param :search, String, desc: 'Text to search deployments for'
    param :order, String, desc: 'Ordering of deployment results'
    param :page, Integer, desc: 'Page of deployment results to display'
    def index
      @deployments = Deployment.includes(:organization, :lifecycle_environment, :discovered_host,
                                         :discovered_hosts, :ose_master_hosts, :ose_worker_hosts, :subscriptions,
                                         :introspection_tasks, :foreman_task, :openstack_deployment)
                                .search_for(params[:search], :order => params[:order]).by_id(params[:id])
                                .paginate(:page => params[:page])
      cnt_search = Deployment.search_for(params[:search], :order => params[:order]).count
      render :json => @deployments,
             :each_serializer => Fusor::DeploymentSerializer,
             :serializer => RootArraySerializer,
             :meta => {:total => cnt_search,
                       :page => params[:page].present? ? params[:page].to_i : 1,
                       :total_pages => (cnt_search / 20.0).ceil
                      }
    end

    api :POST, '/deployments', 'Create a deployment'
    param_group :deployment
    def create
      @deployment = Deployment.new(deployment_params)
      if @deployment.save
        render :json => @deployment, :serializer => Fusor::DeploymentSerializer
      else
        render json: {errors: @deployment.errors}, status: 422
      end
    end

    api :GET, '/deployments/:id', 'Show a deployment'
    param :id, Integer, desc: 'ID of the deployment'
    def show
      render :json => @deployment, :serializer => Fusor::DeploymentSerializer
    end

    api :PUT, '/deployments/:id', 'Update a deployment'
    param :id, Integer, desc: 'ID of the deployment'
    param_group :deployment
    def update
      @deployment.attributes = deployment_params
      @deployment.save(:validate => false)
      render :json => @deployment, :serializer => Fusor::DeploymentSerializer
    end

    api :DELETE, '/deployments/:id', 'Delete a deployment'
    param :id, Integer, desc: 'ID of the deployment'
    def destroy
      @deployment.destroy
      respond_for_show :resource => @deployment
    end

    api :PUT, '/deployments/:id/deploy', 'Start a deployment'
    param :id, Integer, desc: 'ID of the deployment'
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
          @deployment.foreman_task_uuid = task.id
          @deployment.save
        end

        raise "ManageManifest task failed" unless task # Handled by v21

        respond_for_show :resource => @deployment
      rescue ::ActiveRecord::RecordInvalid
        render json: {errors: @deployment.errors}, status: 422
      end
    end

    api :PUT, '/deployments/:id/redeploy', 'Redeploy a deployment that has encountered a content sync error'
    param :id, Integer, required: true, desc: 'ID of the deployment'
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

    api :GET, '/deployments/:id/validate', 'Validate a deployment is ready for deployment'
    param :id, Integer, required: true, desc: 'ID of the deployment'
    def validate
      @deployment.valid?
      error_messages = @deployment.errors.full_messages
      error_messages += @deployment.openstack_deployment.errors.full_messages if @deployment.deploy_openstack?
      warning_messages = @deployment.warnings
      warning_messages += @deployment.openstack_deployment.warnings if @deployment.deploy_openstack?

      render json: {
        :validation => {
          :deployment_id => @deployment.id,
          :errors => error_messages,
          :warnings => warning_messages
        }
      }
    end

    api :GET, '/deployments/:id/validate_cdn', 'Validate a CDN can be used for content sync'
    param :id, Integer, required: true, desc: 'ID of the deployment'
    param :cdn_url, String, desc: 'URL of the CDN the deployment will use'
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

    api :GET, '/deployments/:id/compatible_cpu_families', 'Get a list of compatible CPU families for all selected RHV hypervisor hosts'
    param :id, Integer, required: true, desc: 'ID of the deployment'
    def compatible_cpu_families
      rhv_hypervisors = @deployment.discovered_hosts
      cpu_families = Utils::Fusor::CpuCompatDetector.rhv_cpu_families(rhv_hypervisors)
      render json: cpu_families, status: 200
    end


    api :GET, '/deployments/:id/check_mount_point', 'Check a file mount is available'
    param :id, Integer, required: true, desc: 'ID of the deployment'
    param :address, String, required: true, desc: 'Address of the file server'
    param :path, String, required: true, desc: 'Path of the shared file system'
    param :type, String, required: true, desc: 'Type of file share (NFS/glusterfs)'
    param :unique_suffix, String, required: true, desc: 'Unique suffix allowing async mount validation'
    def check_mount_point
      mount_address = params['address']
      mount_path = params['path']
      mount_type = params['type']
      mount_unique_suffix = params['unique_suffix']

      begin
        mount_result = mount_storage(mount_address, mount_path, mount_type, mount_unique_suffix)
        render json: { :mounted => true, :is_empty => mount_result[:is_empty] }, status: 200
      rescue
        render json: { :mounted => false, :is_empty => false }, status: 200
      end
    end

    # mount_storage will return in megabytes the amount of free space left on the storage mount
    def mount_storage(address, path, type, unique_suffix)
      deployment_id = @deployment.id
      if type == "GFS"
        type = "glusterfs"
      else
        type = "nfs"
      end

      cmd = "sudo safe-mount.sh '#{deployment_id}' '#{unique_suffix}' '#{address}' '#{path}' '#{type}'"
      status, _output = Utils::Fusor::CommandUtils.run_command(cmd)

      raise 'Unable to mount NFS share at specified mount point' unless status == 0

      files = Dir["/tmp/fusor-test-mount-#{deployment_id}-#{unique_suffix}/*"]

      stats = Sys::Filesystem.stat("/tmp/fusor-test-mount-#{deployment_id}-#{unique_suffix}")
      mb_available = stats.block_size * stats.blocks_available / 1024 / 1024

      Utils::Fusor::CommandUtils.run_command("sudo safe-umount.sh #{deployment_id} #{unique_suffix}")
      return {
        :mb_available => mb_available,
        :is_empty => files.size == 0
      }
    end

    api :GET, '/deployments/:id/log', 'Get the log for a deployment'
    param :id, Integer, required: true, desc: 'ID of the deployment'
    param :log_type, String, desc: 'type of log to retrieve (fusor_log/foreman_log/candlepin_log/foreman_proxy_log/ansible_log)'
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
      address = @deployment.rhev_storage_address
      path = @deployment.rhev_share_path
      storage_type = @deployment.rhev_storage_type
      unique_suffix = 'ocp'

      begin
        mount_response = mount_storage(address, path, storage_type, unique_suffix)
        render json: { :openshift_disk_space => mount_response[:mb_available]}, status: 200
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
      allowed = [
        :name, :description, :deploy_rhev, :deploy_cfme,
        :deploy_openstack, :deploy_openshift, :is_disconnected, :rhev_is_self_hosted,
        :rhev_self_hosted_engine_hostname, :rhev_engine_admin_password, :rhev_data_center_name,
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
        :custom_preprend_name, :enable_access_insights,
        :openshift_install_loc, :openshift_number_master_nodes, :openshift_number_worker_nodes,
        :openshift_storage_size, :openshift_username, :openshift_user_password,
        :openshift_master_vcpu, :openshift_master_ram,
        :openshift_master_disk, :openshift_node_vcpu, :openshift_node_ram, :openshift_node_disk,
        :openshift_available_vcpu, :openshift_available_ram, :openshift_available_disk,
        :openshift_storage_type, :openshift_sample_helloworld, :openshift_storage_host,
        :openshift_export_path, :openshift_subdomain_name,
        :cdn_url, :manifest_file, :created_at, :updated_at, :rhev_engine_host_id,
        :organization_id, :lifecycle_environment_id, :discovered_host_id,
        :foreman_task_id, :openstack_deployment_id
      ]

      #############################################################
      # Workaround for permitting the reset of discovered_hosts via accepting
      # discovered_host_ids as an empty array. By default, if it's an empty array,
      # strong params will filter the value so it does not impact an update.
      # See discussion: https://github.com/rails/rails/issues/13766
      #############################################################
      if params[:deployment][:discovered_host_ids].nil?
        allowed << :discovered_host_ids
      else
        allowed << { :discovered_host_ids => [] }
      end
      #############################################################

      params.require(:deployment).permit(*allowed)
    end

    def find_deployment
      id = params[:deployment_id] || params[:id]
      not_found and return false if id.blank?
      @deployment = Deployment.includes(:organization, :lifecycle_environment, :discovered_host, :discovered_hosts,
                                        :ose_master_hosts, :ose_worker_hosts, :subscriptions, :introspection_tasks,
                                        :foreman_task, :openstack_deployment).find(id)
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

      # Remove sensitive data from text being written
      PasswordFilter.extract_deployment_passwords(@deployment)
      text = PasswordFilter.filter_passwords(text)

      Fusor.log.info "====== '#{file}' ====== \n #{text}"
      begin
        File.write(file, text)
      rescue
        Fusor.log.error "Failed to write file : '#{file}'!"
      end
    end

    def ignore_it
      true
    end

    def create_log_reader(log_type_param)
      case log_type_param
        when 'fusor_log'
          ::Fusor::Logging::FusorLogReader.new
        when 'foreman_log'
          ::Fusor::Logging::ForemanLogReader.new
        when 'candlepin_log'
          ::Fusor::Logging::JavaLogReader.new
        when 'foreman_proxy_log'
          ::Fusor::Logging::ProxyLogReader.new
        when 'foreman_proxy_log'
          ::Fusor::Logging::ProxyLogReader.new
        when 'ansible_log'
          ::Fusor::Logging::AnsibleLogReader.new
        else
          ::Fusor::Logging::LogReader.new
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
          File.join(dir, "var/log/foreman/#{Rails.env}.log")
        when 'foreman_proxy_log'
          File.join(dir, 'var/log/foreman-proxy/proxy.log')
        when 'ansible_log'
          File.join(dir, 'ansible.log')
        else
          ::Fusor.log_file_path(@deployment.label, @deployment.id)
      end
    end
  end
end
