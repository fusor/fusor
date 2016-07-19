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

require 'fusor/password_filter'
require 'fusor/deployment_logger'

module Fusor
  class Api::V2::DeploymentsController < Api::V2::BaseController

    before_filter :find_deployment, :only => [:destroy, :show, :update, :deploy]

    def index
      respond :collection => Deployment.all
    end

    def show
      respond :resource => @deployment
    end

    def create
      # Note: we have set validator to not run on create. This is desired,
      # because we create an empty object and fill it in as we go.
      @deployment = Deployment.create!(params[:deployment])
      respond_for_show :resource => @deployment
    end

    def update
      # Note: update_attribute does not call validation. This is desired,
      # because we might not be done building the deployment object yet.
      #@deployment.update_attributes!(params[:deployment])
      for name, value in params[:deployment]
        @deployment.update_attribute(name, value)
      end
      respond_for_show :resource => @deployment
    end

    def destroy
      @deployment.destroy
      respond_for_show :resource => @deployment
    end

    def deploy
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
    end

    private

    def find_deployment
      not_found and return false if params[:id].blank?
      @deployment = Deployment.find(params[:id])
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
  end
end
