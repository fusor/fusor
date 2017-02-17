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
        class InstallOSE < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Install Openshift Enterprise onto deployed VMs")
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.info "================ OpenShift InstallOSE run method ===================="
            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            opts = Utils::Fusor::OcpUtils.parse_deployment(deployment)

            launcher = OSEInstaller::Launch.new("#{Rails.root}/tmp/#{deployment.label}", ::Fusor.log_file_dir(deployment.label, deployment.id), ::Fusor.log)
            inventory = launcher.prepare(opts)

            # Workaround for https://trello.com/c/4T7e9IFr
            success = false
            3.times do |i|
              if deployment.ose_master_hosts.length > 1
                exit_code = launcher.ha_install(inventory, true)
              else
                exit_code = launcher.install(inventory, true)
              end
              if exit_code > 0
                ::Fusor.log.info("ansible-playbook returned a non-zero exit code on attempt #{i + 1}/3.")
              else
                success = true
                break
              end
            end
            # End workaround

            if !success
              # Something went wrong w/ the installation
              fail _("ansible-playbook returned a non-zero exit code during installation. Please refer to the log"\
                 " for more information regarding the failure.")
            end

            ::Fusor.log.info "================ Leaving OpenShift InstallOSE run method ===================="
          end
        end
      end
    end
  end
end
