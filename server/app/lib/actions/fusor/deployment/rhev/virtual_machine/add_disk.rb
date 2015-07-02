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
        module VirtualMachine
          class AddDisk < Actions::Base
            def humanized_name
              _("Add Disk to Virtual Machine")
            end

            def plan(deployment, vm_id)
              plan_self(deployment_id: deployment.id,
                        vm_id: vm_id)
            end

            def run
              Rails.logger.info "================ VirtualMachine::AddDisk run method ===================="

              deployment = ::Fusor::Deployment.find(input[:deployment_id])
              script_dir = "/usr/share/fusor_ovirt/bin/"
              api_host = deployment.rhev_engine_host.facts['ipaddress']

              storage_size = "20" # TODO: should this be configurable on the deployment?
              cmd = "#{script_dir}ovirt_add_disk_to_vm.py "\
                "--api_host #{api_host} "\
                "--api_pass #{deployment.rhev_engine_admin_password} "\
                "--size_gb #{storage_size} "\
                "--storage_domain #{deployment.rhev_storage_name} "\
                "--vm_id #{input[:vm_id]}"

              status, cmd_output = run_command(cmd)
              unless status == 0
                fail _("Unable to add disk to virtual machine: %{output}") % { :output => cmd_output.join('; ') }
              end
              Rails.logger.info "================ Leaving VirtualMachine::AddDisk run method ===================="
            end

            private

            def run_command(cmd)
              Rails.logger.info "Running: #{cmd}"
              status, output = Utils::Fusor::CommandUtils.run_command(cmd)
              Rails.logger.debug "Status: #{status}, output: #{output}"
              return status, output
            end
          end
        end
      end
    end
  end
end
