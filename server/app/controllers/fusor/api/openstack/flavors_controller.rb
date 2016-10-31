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
  module Api
    module Openstack
      class FlavorsController < Api::Openstack::BaseController

        resource_description do
          name 'OpenStack Flavors'
          desc 'OpenStack flavors of nodes'
          api_version 'fusor_v21'
          api_base_url '/fusor/api/openstack/deployments/:deployment_id'
        end

        api :GET, '/flavors', 'Get a list OpenStack flavors'
        param :deployment_id, Integer, desc: 'ID of the deployment'
        def index
          flavor_json_array = Array.new
          for flavor in undercloud_handle.list_flavors
            flavor_json_array << flavor_json_with_extra_specs(flavor)
          end
          render :json => {:flavors => flavor_json_array}
        end

        api :GET, '/flavors', 'Get OpenStack flavor by ID'
        param :deployment_id, Integer, desc: 'ID of the deployment'
        param :id, Integer, desc: 'ID number of the flavor'
        def show
          render :json => {:flavor => flavor_json_with_extra_specs(undercloud_handle.get_flavor(params[:id]))}
        end

        private

        def flavor_json_with_extra_specs(flavor)
          flavor_json = flavor.as_json
          flavor_json['extra_specs'] = undercloud_handle.get_flavor_extra_specs(flavor.id).as_json
          return flavor_json
        end

      end
    end
  end
end
