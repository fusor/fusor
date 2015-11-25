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
require 'fog'

module Actions
  module Fusor
    module Deployment
      module OpenStack
        # Add URL and Password to deployment model
        class OvercloudCredentials < Actions::Base
          def humanized_name
            _('Add URL and Password to deployment model')
          end

          def plan(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            Rails.logger.debug '====== OvercloudCredentials run method ======'
            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            deployment.openstack_overcloud_password = get_passwd(deployment)
            deployment.openstack_overcloud_address = get_address(deployment)
            deployment.save!
            Rails.logger.debug '=== Leaving OvercloudCredentials run method ==='
          end

          def overcloud_credentials_completed
            Rails.logger.info 'Overcloud Credentials saved'
          end

          def overcloud_credentials_failed
            fail _('Failed to Retreive Overcloud Credentials')
          end

          private

          def get_passwd(deployment)
            undercloud = Overcloud::UndercloudHandle.new('admin',
                                                         deployment.openstack_undercloud_password,
                                                         deployment.openstack_undercloud_ip_addr,
                                                         5000)
            undercloud.get_plan_parameter_value('overcloud', 'Controller-1::AdminPassword')
          end

          def get_address(deployment)
            service = Fog::Orchestration::OpenStack.new(
              :openstack_auth_url  => "http://#{deployment.openstack_undercloud_ip_addr}:5000/v2.0/tokens",
              :openstack_username  => 'admin',
              :openstack_tenant    => 'admin',
              :openstack_api_key   => deployment.openstack_undercloud_password)
            stack = service.stacks.get("overcloud", service.stacks.first.id)
            stack.outputs.find { |hash| hash["output_key"] == "PublicVip" }["output_value"]
          end
        end
      end
    end
  end
end
