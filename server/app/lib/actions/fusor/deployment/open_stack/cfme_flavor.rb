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

require 'fog'

module Actions
  module Fusor
    module Deployment
      module OpenStack
        #Configure CFME Flavor
        class CfmeFlavor < Actions::Fusor::FusorBaseAction
          def humanized_name
            _('Configure CFME Flavor')
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.debug '====== CFME Flavor run method ======'
            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            overcloud = { :openstack_auth_url  => "https://#{deployment.openstack_deployment.overcloud_hostname}:13000/v2.0/tokens",
                          :openstack_username  => 'admin', :openstack_tenant => 'admin',
                          :openstack_api_key   => deployment.openstack_deployment.overcloud_password }
            compute = Fog::Compute::OpenStack.new(overcloud)
            begin
              compute.flavors.create :name => "cfme", :ram => 8192, :vcpus => 4, :disk => 80, :is_public => 'true'
            rescue Excon::Error::Conflict
              ::Fusor.log.debug 'Flavor already exists'
            end
            ::Fusor.log.debug '====== Leaving CFME Flavor run method ======'
          end

          def cfme_flavor_completed
            ::Fusor.log.info 'CFME Flavor Creation Completed'
          end

          def cfme_flavor_failed
            fail _('CFME Flavor Creation failed')
          end
        end
      end
    end
  end
end
