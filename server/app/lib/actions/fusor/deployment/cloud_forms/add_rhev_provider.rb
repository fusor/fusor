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
        class AddRhevProvider < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Add RHEV Provider")
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.debug "================ AddRhevProvider run method ===================="

            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            cfme_address = deployment.cfme_address
            provider = { :name => "#{deployment.label}-RHEV",
                         :type => "rhevm",
                         :hostname => deployment.rhev_engine_host.name,
                         :ip => deployment.rhev_engine_host.ip,
                         :username => "admin@internal", # TODO: perhaps make configurable, in future
                         :password => deployment.rhev_engine_admin_password,
                         :hypervisors => deployment.discovered_hosts
            }

            ::Fusor.log.info "Adding RHEV provider #{provider[:name]} to CFME."

            Utils::CloudForms::InfraProvider.add(cfme_address, provider, deployment)
            Utils::CloudForms::AddCredentialsForHosts.add(cfme_address, deployment)

            ::Fusor.log.debug "================ Leaving AddRhevProvider run method ===================="
          end
        end
      end
    end
  end
end
