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
        class WaitForDataCenter < Actions::Base
          include Actions::Base::Polling

          input_format do
            param :deployment_id
          end

          def humanized_name
            _("Wait for Virtualization Data Center")
          end

          def plan(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def done?
            external_task
          end

          def invoke_external_task
            is_up? get_status(input[:deployment_id])
          end

          def poll_external_task
            is_up? get_status(input[:deployment_id])
          end

          private

          def get_status(deployment_id)
            Rails.logger.info "================ Rhev::WaitForDataCenter get_status method ===================="

            # If the api_host ip is available, use it to check the status of the data center.
            # If it isn't available, it is likely that the puppet facts have not been uploaded,
            # yet; therefore, skip checking the status until the next interval.
            deployment = ::Fusor::Deployment.find(deployment_id)
            api_host = deployment.rhev_engine_host.facts['ipaddress']
            unless api_host.blank?
              script_dir = "/usr/share/fusor_ovirt/bin/"
              api_user = "admin@internal"
              api_password = deployment.rhev_engine_admin_password
              # if db name is empty or nil, use Default
              data_center = deployment.rhev_database_name.to_s[/.+/m] || "Default"

              cmd = "#{script_dir}ovirt_get_datacenter_status.py "\
                "--api_user #{api_user} "\
                "--api_host #{api_host} "\
                "--api_pass #{api_password} "\
                "--data_center #{data_center}"

              status, output = Utils::Fusor::CommandUtils.run_command(cmd)
              { status: status, output: output }
            end
          end

          def is_up?(status)
            !status.nil? && (status[:status] == 0) && ("up" == status[:output].first.rstrip) ? true : false
          end
        end
      end
    end
  end
end
