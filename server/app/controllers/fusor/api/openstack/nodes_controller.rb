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
          render :json => undercloud_handle.list_nodes
        end

        def show
          render :json => undercloud_handle.get_node(params[:id])
        end

        def create
          handle = undercloud_handle
          node_uuids = handle.list_nodes.map { |i| i.uuid }
          begin
            node = handle.create_node_only(params[:node])
          rescue Excon::Errors::Conflict => e
            if e.response[:body] =~ /A port with MAC address .* already exists/
              # We've registered this node already, This request caused
              # a bad node to get created in the director. Delete it to
              # clean up after ourselves if we can figure out which one it is
              # and then re-throw the error.
              current_node_uuids = handle.list_nodes.map { |i| i.uuid }
              new_nodes = current_node_uuids - node_uuids
              if new_nodes.length == 1
                handle.delete_node(new_nodes.first)
              end
            end
            raise e
          end

          task = async_task(::Actions::Fusor::Host::IntrospectOpenStackNode, @deployment, node.uuid)
          it = Fusor::IntrospectionTask.new
          it.deployment = @deployment
          it.task_id = task.id
          it.node_uuid = node.uuid
          it.mac_address = params[:node][:address]
          it.task_id = task.id
          @deployment.introspection_tasks.push(it)
          @deployment.save(:validate => false)
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
