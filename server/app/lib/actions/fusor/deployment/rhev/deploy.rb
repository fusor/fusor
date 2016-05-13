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
      module Rhev
        class Deploy < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Deploy Red Hat Enterprise Virtualization")
          end

          def plan(deployment)
            super(deployment)

            sequence do
              if deployment.rhev_is_self_hosted
                # Self-hosted RHEV
                fail _("Unable to locate a RHEV Hypervisor Host") unless (deployment.discovered_hosts.count > 0)
                # TODO(fabianvf): additional hypervisors
                hypervisor = deployment.discovered_hosts[0]

                plan_action(::Actions::Fusor::Deployment::Rhev::CreateEngineHostRecord, deployment, 'RHEV-Self-hosted')
                plan_action(::Actions::Fusor::Host::TriggerProvisioning,
                            deployment,
                            "RHEV-Self-hosted",
                            hypervisor)
                plan_action(::Actions::Fusor::Host::WaitUntilProvisioned,
                            hypervisor.id)
              else
                # Hypervisor + Engine separate

                fail _("Unable to locate a RHEV Engine Host") unless deployment.rhev_engine_host

                deployment.discovered_hosts.each do |host|
                  plan_action(::Actions::Fusor::Host::TriggerProvisioning,
                              deployment,
                              "RHEV-Hypervisor",
                              host)
                end

                concurrence do
                  deployment.discovered_hosts.each do |host|
                    plan_action(::Actions::Fusor::Host::WaitUntilProvisioned,
                                host.id)
                  end
                end
                plan_action(::Actions::Fusor::Host::TriggerProvisioning,
                            deployment,
                            "RHEV-Engine",
                            deployment.rhev_engine_host)

                plan_action(::Actions::Fusor::Host::WaitUntilProvisioned,
                            deployment.rhev_engine_host.id)
              end

              plan_action(::Actions::Fusor::Deployment::Rhev::WaitForDataCenter,
                            deployment)
              plan_action(::Actions::Fusor::Deployment::Rhev::CreateCr, deployment)
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
end
