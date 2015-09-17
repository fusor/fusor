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
require 'strong_parameters'

module Fusor
  module Api
    module Openstack
      class BaseController < ::Katello::Api::V2::ApiController
        before_filter :find_deployment

        # TODO: REMOVE CORS FILTER ONCE EMBER PROXY IS UNNEEDED
        after_filter :cors_set_access_control_headers

        resource_description do
          resource_id 'fusor'
          api_version 'openstack'
          api_base_url '/fusor/api'
        end

        def cors_set_access_control_headers
          response.headers['Access-Control-Allow-Origin'] = '*'
          response.headers['Access-Control-Allow-Methods'] = 'POST, PUT, GET, OPTIONS'
          response.headers['Access-Control-Request-Method'] = '*'
          response.headers['Access-Control-Allow-Headers'] = '*'
          response.headers['Access-Control-Max-Age'] = "1728000"
        end

        private

        def find_deployment
          not_found and return false if params[:deployment_id].blank?
          @deployment = Deployment.find(params[:deployment_id])
        end

        def undercloud_handle
          return Overcloud::UndercloudHandle.new('admin', @deployment.openstack_undercloud_password, @deployment.openstack_undercloud_ip_addr, 5000)
        end

      end
    end
  end
end
