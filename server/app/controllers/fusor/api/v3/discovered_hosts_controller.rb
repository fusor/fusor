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
  class Api::V3::DiscoveredHostsController < ::Api::V2::DiscoveredHostsController

    #include Api::Version3

    def index
      super
      render :json => @discovered_hosts, :each_serializer => DiscoveredHostSerializer
    end

    def show
      super
      render :json => @discovered_host, :serializer => DiscoveredHostSerializer
    end

    # using rename rather than update since PUT update started the provision
    # TODO add functional test
    def rename
      not_found and return false if params[:id].blank?
      @discovered_host = ::Host::Discovered.find(params[:id])
      @discovered_host.update_attributes(:name => params[:data][:attributes][:name])
      render :json => @discovered_host, :serializer => DiscoveredHostSerializer
    end

    private

    def action_permission
      case params[:action]
      when 'rename'
        :edit
      else
        super
      end
    end

  end
end
