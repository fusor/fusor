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
  class Api::V21::DeploymentsController < Api::V2::DeploymentsController

    before_filter :find_deployment, :only => [:destroy, :show, :update, :deploy]

    rescue_from Encoding::UndefinedConversionError, :with => :ignore_it

    def index
      @deployments = Deployment.search_for(params[:search], :order => params[:order]).by_id(params[:id])
      render :json => @deployments, :each_serializer => Fusor::DeploymentSerializer
    end

    def show
      render :json => @deployment, :serializer => Fusor::DeploymentSerializer
    end

    def create
      @deployment = Deployment.new(params[:deployment])
      if @deployment.save
        render :json => @deployment, :serializer => Fusor::DeploymentSerializer
      else
        render json: {errors: @deployment.errors}, status: 422
      end
    end

    def update
      # update_attribute does not call validation, which is desired, while
      # update_attributes does. Horay consistency!
      for name, value in params[:deployment]
        @deployment.update_attribute(name, value)
      end
      render :json => @deployment, :serializer => Fusor::DeploymentSerializer
    end

    def destroy
      @deployment.destroy
      respond_for_show :resource => @deployment
    end

    def deploy
      # just inherit from V2
      begin
        super
      rescue ::ActiveRecord::RecordInvalid
        render json: {errors: @deployment.errors}, status: 422
      end
    end

    private

    def find_deployment
      not_found and return false if params[:id].blank?
      @deployment = Deployment.find(params[:id])
    end

    def ignore_it
      true
    end

  end
end
