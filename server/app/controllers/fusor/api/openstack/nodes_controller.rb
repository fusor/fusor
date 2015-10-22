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
          @node = undercloud_handle.create_node(params[:node])
          task = async_task(::Actions::Fusor::Host::IntrospectOpenStackNode, @deployment, @node.uuid)
          respond_for_async :resource => task
        end

        def ready
          ready = undercloud_handle.introspect_node_status(params[:id])
          render :json => {:node => {:id => params[:id], :ready => ready}}.to_json
        end

      end
    end
  end
end
