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
  class Api::V3::LifecycleEnvironmentsController < Api::V3::BaseController

    #include Api::Version3

    before_filter :find_organization, :only => [:index, :create, :show, :update, :destroy]
    before_filter :find_lifecycle_environment, :only => [:show, :update, :destroy]

    def index
      @lifecycle_environments = ::Katello::KTEnvironment.readable.where(:organization_id => @organization.id)
      render :json => @lifecycle_environments, :each_serializer => Fusor::LifecycleEnvironmentSerializer
    end

    def show
      render :json => @lifecycle_environment, :serializer => Fusor::LifecycleEnvironmentSerializer
    end

    def create
      @lifecycle_environment = ::Katello::KTEnvironment.new(environment_params)
      if @lifecycle_environment.save
        ## Add environment to Org
        #@organization.kt_environments << @environment
        #@organization.save!
        render :json => @lifecycle_environment, :serializer => Fusor::LifecycleEnvironmentSerializer
      else
        render json: {errors: @lifecycle_environment.errors}, status: 422
      end
    end

    def update
      if @lifecycle_environment.save
        ## Add environment to Org
        #@organization.kt_environments << @environment
        #@organization.save!
        render :json => @lifecycle_environment, :serializer => Fusor::LifecycleEnvironmentSerializer
      else
        render json: {errors: @lifecycle_environment.errors}, status: 422
      end
    end

    private

    def find_lifecycle_environment
      @lifecycle_environment = ::Katello::KTEnvironment.find_by_id(params[:id])
      return @lifecycle_environment if @lifecycle_environment
      return :json => {:error => "Couldn't find organization" }
    end

    def find_organization
      @organization = ::Organization.find_by_id(params[:organization_id])
      return @organization if @organization
      return :json => {:error => "Couldn't find organization" }
    end

    def environment_params
      # add belongs_to attribute: organization_id
      if params[:data][:relationships]
        if (organization = params[:data][:relationships][:organization])
          organization_id = organization[:data] ? organization[:data][:id] : nil
          params[:data][:attributes][:organization_id] = organization_id
        end
      end

      params.require(:data).require(:attributes).permit(:name,
        :description, :label, :prior, :organization_id)
    end

  end
end
