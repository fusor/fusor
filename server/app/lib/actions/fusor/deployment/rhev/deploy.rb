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
            _("Deploy Red Hat Virtualization")
          end

          def plan(deployment)
            super(deployment)
            if deployment.rhev_is_self_hosted
              fail _("Unable to locate a RHV Hypervisor Host") unless (deployment.discovered_hosts.count > 0)
            else
              fail _("Unable to locate a RHV Engine Host") unless deployment.rhev_engine_host
            end

            sequence do

              plan_action(::Actions::Fusor::Deployment::Rhev::CreateEngineHostRecord, deployment, 'RHV-Engine') if deployment.rhev_is_self_hosted

              hosts_with_hostgroups(deployment).each do |host, hostgroup|
                plan_action(::Actions::Fusor::Host::TriggerProvisioning,
                            deployment,
                            hostgroup,
                            host)

              end

              concurrence do
                hosts_with_hostgroups(deployment).each do |host, hostgroup|
                  plan_action(::Actions::Fusor::Host::WaitUntilProvisioned,
                              host.id)
                end
              end

              plan_action(::Actions::Fusor::Deployment::Rhev::TriggerAnsibleRun, deployment)
              plan_action(::Actions::Fusor::Deployment::Rhev::WaitForDataCenter,
                            deployment)
              plan_action(::Actions::Fusor::Deployment::Rhev::CreateCr, deployment)
            end

          end

          private

          def hosts_with_hostgroups(deployment)
            if deployment.rhev_is_self_hosted
              deployment.discovered_hosts.map { |h| [h, 'RHV-Self-hosted'] }
            else
              deployment.discovered_hosts.map { |h| [h, 'RHV-Hypervisor'] }.push [deployment.rhev_engine_host, 'RHV-Engine']
            end
          end
        end
      end
    end
  end
end
