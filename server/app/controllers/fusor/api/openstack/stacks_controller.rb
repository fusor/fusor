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
      class StacksController < Api::Openstack::BaseController

        resource_description do
          name 'OpenStack Stacks'
          desc 'OpenStack stacks'
          api_version 'fusor_v21'
          api_base_url '/fusor/api/openstack/deployments/:deployment_id'
        end

        api :GET, '/stacks', 'Get OpenStack stacks'
        param :deployment_id, Integer, desc: 'ID of the deployment'
        def index
          stacks = undercloud_handle.list_stacks
          render :json => stacks, :serializer => RootArraySerializer
        end

        api :GET, '/flavors', 'Get OpenStack flavor by name'
        param :deployment_id, Integer, desc: 'ID of the deployment'
        param :name, String, desc: 'Name of the stack (ex. overcloud)'
        def show
          render :json => {:stack => undercloud_handle.get_stack_by_name(params[:name])}
        end

        api :DELETE, '/flavors', 'Delete OpenStack flavor by name'
        param :deployment_id, Integer, desc: 'ID of the deployment'
        param :name, String, desc: 'Name of the stack to delete (ex. overcloud)'
        def destroy
          stack = undercloud_handle.get_stack_by_name(params[:name])
          undercloud_handle.delete_stack(stack) if stack
          render json: {}, status: 204
        end
      end
    end
  end
end
