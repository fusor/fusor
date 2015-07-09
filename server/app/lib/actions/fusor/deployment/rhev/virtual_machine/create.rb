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
          class Create < Actions::Base
            def humanized_name
              _("Create Virtual Machine")
            end

            def plan(deployment, template_name)
              plan_self(deployment_id: deployment.id,
                        template_name: template_name)
            end

            def run
              Rails.logger.info "================ VirtualMachine::Create run method ===================="

              deployment = ::Fusor::Deployment.find(input[:deployment_id])
              script_dir = "/usr/share/fusor_ovirt/bin/"
              api_host = deployment.rhev_engine_host.facts['ipaddress']

              vm_name = "#{deployment.name}-cfme" # TODO: we may need to be more descriptive in the name of the VM

              cmd = "#{script_dir}ovirt_create_vm_from_template.py "\
                "--api_host #{api_host} "\
                "--api_pass #{deployment.rhev_engine_admin_password} "\
                "--vm_template_name #{input[:template_name]} "\
                "--cluster_name #{deployment.rhev_cluster_name} "\
                "--vm_name #{vm_name}"

              status, cmd_output = run_command(cmd)
              unless status == 0
                fail _("Unable to create virtual machine from template: %{output}") % { :output => cmd_output.join('; ') }
              end
              sleep 10 # TODO: pause for a few seconds so that the vm creation completes

              output[:vm_id] = cmd_output.first.rstrip

              Rails.logger.info "================ Leaving VirtualMachine::Create run method ===================="
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
