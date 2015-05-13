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
      class DeployRhev < Actions::Base
        def humanized_name
          _("Deploy Red Hat Enterprise Virtualization")
        end

        def plan(deployment)
          fail _("Unable to locate a RHEV Engine Host") unless deployment.rhev_engine_host

          sequence do
            concurrence do
              deployment.discovered_hosts.each do |host|
                plan_action(::Actions::Fusor::Host::TriggerProvisioning,
                            deployment,
                            "RHEV-Hypervisor",
                            host)

                plan_action(::Actions::Fusor::Host::WaitUntilProvisioned,
                            host)
              end
            end

            plan_action(::Actions::Fusor::Host::TriggerProvisioning,
                        deployment,
                        "RHEV-Engine",
                        deployment.rhev_engine_host)

            plan_action(::Actions::Fusor::Host::WaitUntilProvisioned,
                        deployment.rhev_engine_host)
          end
        end

        private

        def hosts_to_provision(deployment)
          deployment.discovered_hosts + [deployment.rhev_engine_host]
        end
      end
    end
  end
end
