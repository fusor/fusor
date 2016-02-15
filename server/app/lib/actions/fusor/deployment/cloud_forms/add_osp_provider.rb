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

module Actions
  module Fusor
    module Deployment
      module CloudForms
        class AddOspProvider < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Add OSP Provider")
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.debug "================ AddOspProvider run method ===================="

            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            cfme_address = deployment.cfme_address
            provider = { :name => "#{deployment.label}-RHOS",
                         :ip => deployment.openstack_overcloud_address,
                         :username => "admin",
                         :password => deployment.openstack_overcloud_password
            }

            ::Fusor.log.info "Adding OSP provider #{provider[:name]} to CFME."

            Utils::CloudForms::CloudProvider.add(cfme_address, provider, deployment)
            ::Fusor.log.debug "================ Leaving AddOspProvider run method ===================="
          end
        end
      end
    end
  end
end
