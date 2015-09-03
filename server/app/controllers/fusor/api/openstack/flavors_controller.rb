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

        def index
          flavor_json_array = Array.new
          for flavor in undercloud_handle.list_flavors
            flavor_json_array << flavor_json_with_extra_specs(flavor)
          end
          render :json => {:flavors => flavor_json_array}
        end

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
