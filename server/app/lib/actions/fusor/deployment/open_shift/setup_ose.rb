#
# Copyright 2016 Red Hat, Inc.
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
      module OpenShift
        class SetupOSE < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Installation setup for Openshift Enterprise in deployed VMs")
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.info "================ OpenShift SetupOSE run method ===================="

            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            opts = Utils::Fusor::OcpUtils.parse_deployment(deployment)

            # Record master load-balancer on deployment object if running OCP HA deploy
            if opts[:ha_nodes].length > 1
              deployment.ose_lb_master_hosts = [deployment.ose_ha_hosts.find_by_name(opts[:ha_lb_master])]
              deployment.save!
            end

            ::Fusor.log.info "Setting ansible log path to - #{::Fusor.log_file_dir(deployment.label, deployment.id)}"
            launcher = OSEInstaller::Launch.new("#{Rails.root}/tmp/#{deployment.label}", ::Fusor.log_file_dir(deployment.label, deployment.id), ::Fusor.log)
            inventory = launcher.prepare(opts)

            if deployment.ose_master_hosts.length > 1
              exit_code = launcher.ha_setup(inventory, true)
            else
              exit_code = launcher.setup(inventory, true)
            end

            if exit_code > 0
              # Something went wrong w/ the setup
              fail _("ansible-playbook returned a non-zero exit code during setup. Please refer to the log"\
                 " for more information regarding the failure.")
            end

            ::Fusor.log.info "================ Leaving OpenShift SetupOSE run method ===================="
          end
        end
      end
    end
  end
end
