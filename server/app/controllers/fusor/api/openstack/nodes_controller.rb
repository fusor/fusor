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
      class NodesController < Api::Openstack::BaseController

        def index
          render :json => undercloud_handle.list_nodes, :serializer => RootArraySerializer
        end

        def show
          render :json => undercloud_handle.get_node(params[:id])
        end

        def create
          handle = undercloud_handle

          begin
            node = handle.create_node_only(params[:node])
          rescue Excon::Errors::Conflict => undercloud_error
            body = JSON.parse(undercloud_error.response.try(:body))
            error_message = JSON.parse(body.try(:[], 'error_message'))
            fault_string = error_message.try(:[], 'faultstring')
            status = undercloud_error.response.try(:status)
            raise undercloud_error unless fault_string && status
            return render json: {displayMessage: fault_string, errors: [fault_string]}, status: status
          end

          task = async_task(::Actions::Fusor::Host::IntrospectOpenStackNode, @deployment, node.uuid)
          Fusor::IntrospectionTask.create({deployment: @deployment,
                                           task_id: task.id,
                                           node_uuid: node.uuid,
                                           mac_address: params[:node][:address]})
          respond_for_async :resource => task
        end

        def destroy
          undercloud_handle.delete_node(params[:id])
          Fusor::IntrospectionTask.where(:node_uuid => params[:id]).destroy_all
          render json: {}, status: 204
        end

        def ready
          ready = undercloud_handle.introspect_node_status(params[:id])
          render :json => {:node => {:id => params[:id], :ready => ready}}.to_json
        end

        def list_ports
          render :json => { :ports => undercloud_handle.list_ports_detailed }
        end

        def discover_macs
          render :json => { :nodes => Utils::Fusor::DiscoverMacs.new(params).discover }
        end
      end
    end
  end
end
