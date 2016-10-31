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

require 'egon'

module Fusor
  module Api
    module Openstack
      class DeploymentPlansController < Api::Openstack::BaseController

        resource_description do
          name 'OpenStack Deployment Plans'
          desc 'OpenStack deployment plan on the undercloud'
          api_version 'fusor_v21'
          api_base_url '/fusor/api/openstack/deployments/:deployment_id'
        end

        api :POST, '/deployment_plans/:name', 'Show the undercloud deployment status'
        param :deployment_id, Integer, required: true, desc: 'ID of the deployment'
        param :name, String, required: true, desc: 'Name of the deployment plan (ex. overcloud)'
        def deploy
          @plan = undercloud_handle.deploy_plan(params[:name])
          render :json => build_deployment_plan(params[:name])
        end

        api :GET, '/deployment_plans/:name', 'Get the deployment plan.  Includes name, parameters, and roles'
        param :deployment_id, Integer, required: true, desc: 'ID of the deployment'
        param :name, String, required: true, desc: 'Name of the deployment plan (ex. overcloud)'
        def show
          render :json => build_deployment_plan(params[:name])
        end

        def update_role_count
          @plan = undercloud_handle.edit_plan_deployment_role_count(params[:name], params[:role_name], params[:count])
          render :json => build_deployment_plan(params[:name])
        end

        def update_role_flavor
          @plan = undercloud_handle.edit_plan_deployment_role_flavor(params[:name], params[:role_name], params[:flavor_name])
          render :json => build_deployment_plan(params[:name])
        end

        api :PUT, '/deployment_plans/:id/update_parameters', 'Updates deployment plan parameters'
        param :deployment_id, Integer, required: true, desc: 'ID of the deployment'
        param :name, String, required: true, desc: 'Name of the deployment plan (ex. overcloud)'
        param :parameters, Hash, desc: 'Hash of deployment plan parameters to change'
        def update_parameters
          @plan = undercloud_handle.edit_plan_parameters(params[:name], params[:parameters])
          render :json => build_deployment_plan(params[:name])
        end

        private

        def build_deployment_plan(plan_name)
          {
              deployment_plan: {
                  name: 'overcloud',
                  parameters: undercloud_handle.get_plan_parameters(plan_name),
                  roles: undercloud_handle.get_plan_deployment_roles(plan_name)
              }
          }
        end
      end
    end
  end
end
