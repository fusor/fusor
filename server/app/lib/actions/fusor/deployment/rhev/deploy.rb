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
                fail _("Unable to locate an RHV Hypervisor Host") unless (deployment.discovered_hosts.count > 0)

                first_host = deployment.discovered_hosts[0]
                additional_hosts = deployment.discovered_hosts[1..-1]

                plan_action(::Actions::Fusor::Deployment::Rhev::CreateEngineHostRecord, deployment, 'RHEV-Self-hosted')
                plan_action(::Actions::Fusor::Host::TriggerProvisioning,
                            deployment,
                            "RHEV-Self-hosted",
                            first_host)

                plan_action(::Actions::Fusor::Host::WaitUntilProvisioned,
                            first_host.id, true)

                additional_hosts.each_with_index do |host, index|
                  # Override puppet class for host_id and is additional host
                  puppetclass_id = Puppetclass.where(:name => 'ovirt::self_hosted::setup').first.id
                  overrides = {
                    puppetclass_id => {
                     :host_id => (index + 2),
                     :additional_host => true
                    }
                  }
                  plan_action(::Actions::Fusor::Host::TriggerProvisioning,
                              deployment,
                              "RHEV-Self-hosted",
                              host, overrides)
                end
                concurrence do
                  additional_hosts.each do |host|
                    plan_action(::Actions::Fusor::Host::WaitUntilProvisioned,
                                host.id, true)
                  end
                end

              else
                # Hypervisor + Engine separate

                fail _("Unable to locate an RHV Engine Host") unless deployment.rhev_engine_host

                deployment.discovered_hosts.each do |host|
                  plan_action(::Actions::Fusor::Host::TriggerProvisioning,
                              deployment,
                              "RHEV-Hypervisor",
                              host)
                end

                concurrence do
                  deployment.discovered_hosts.each do |host|
                    plan_action(::Actions::Fusor::Host::WaitUntilProvisioned,
                                host.id, true)
                  end
                end
                plan_action(::Actions::Fusor::Host::TriggerProvisioning,
                            deployment,
                            "RHEV-Engine",
                            deployment.rhev_engine_host)


                plan_action(::Actions::Fusor::Host::WaitUntilProvisioned,
                            deployment.rhev_engine_host.id, true)

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
