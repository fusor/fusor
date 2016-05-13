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
        class ImportTemplate < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Import Template in to Virtualization Environment")
          end

          def plan(deployment, template_name)
            super(deployment)
            plan_self(deployment_id: deployment.id,
                      template_name: template_name)
          end

          def run
            ::Fusor.log.debug "================ ImportTemplate run method ===================="

            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            script_dir = "/usr/share/fusor_ovirt/bin/"
            api_user = "admin@internal"
            api_host = deployment.rhev_engine_host.ip

            # TODO: Revisit how the data center is stored in the deployment object
            #       it'd be better to store "Default" in it opposed to allowing it to be empty
            # Warning, the rhev_data_center_name may be empty, if so then assume value of "Default"
            data_center = deployment.rhev_data_center_name.to_s[/.+/m] || "Default"

            cmd = "#{script_dir}ovirt_import_template.py "\
                "--api_user '#{api_user}' "\
                "--api_pass #{deployment.rhev_engine_admin_password} "\
                "--api_host #{api_host} "\
                "--cluster_name #{deployment.rhev_cluster_name} "\
                "--data_center_name #{data_center} "\
                "--export_domain_name #{deployment.rhev_export_domain_name} " \
                "--storage_domain_name #{deployment.rhev_storage_name} "\
                "--vm_template_name #{input[:template_name]}"

            status, output = run_command(cmd)
            if status != 0
              fail _("Unable to import template: Status: %{status}. Output: %{output}") % { :status => status,
                                                                                            :output => output }
            end
            ::Fusor.log.debug "================ Leaving ImportTemplate run method ===================="
          end

          private

          def run_command(cmd)
            ::Fusor.log.info "Running: #{cmd}"
            status, output = Utils::Fusor::CommandUtils.run_command(cmd)
            ::Fusor.log.debug "Status: #{status}, output: #{output}"
            return status, output
          end
        end
      end
    end
  end
end
