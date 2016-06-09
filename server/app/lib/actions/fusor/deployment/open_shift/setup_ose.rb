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
            opts = parse_deployment(deployment)
            ::Fusor.log.info "Setting ansible log path to - #{::Fusor.log_file_dir(deployment.label, deployment.id)}"
            launcher = OSEInstaller::Launch.new("#{Rails.root}/tmp/#{deployment.name}", ::Fusor.log_file_dir(deployment.label, deployment.id), ::Fusor.log)
            inventory = launcher.prepare(opts)
            exit_code = launcher.setup(inventory, true)
            if exit_code > 0
              # Something went wrong w/ the setup
              fail _("ansible-playbook returned a non-zero exit code during setup. Please refer to the log"\
                 " for more information regarding the failure.")
            end

            ::Fusor.log.info "================ Leaving OpenShift SetupOSE run method ===================="
          end

          def parse_deployment(deployment)
            opts = Hash.new

            masters = Array.new
            deployment.ose_master_hosts.each do |m|
              masters << m.name
            end

            workers = Array.new
            deployment.ose_worker_hosts.each do |w|
              workers << w.name
            end

            opts[:masters] = masters
            opts[:nodes] = workers

            opts[:username] = deployment.openshift_username
            opts[:ssh_key] = deployment.ose_private_key_path

            # Workaround for https://trello.com/c/33ef176y
            # // nothing

            opts[:docker_registry_host] = deployment.openshift_storage_host
            opts[:docker_registry_path] = deployment.openshift_export_path

            opts[:docker_storage] = "/dev/vdb"
            opts[:docker_volume] = "docker-vg"
            opts[:storage_type] = deployment.openshift_storage_type

            opts[:ose_user] = deployment.openshift_username
            opts[:ose_password] = "deployment.openshift_user_password"

            opts[:subdomain_name] = deployment.openshift_subdomain_name

            opts
          end
        end
      end
    end
  end
end
