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
    end

    private

    def find_deployment
      not_found and return false if params[:id].blank?
      @deployment = Deployment.find(params[:id])
    end

    def customer_portal_credentials
      { :username => session[:portal_username], :password => session[:portal_password] }
    end
  end
end
