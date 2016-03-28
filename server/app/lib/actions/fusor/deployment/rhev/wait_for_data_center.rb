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
        class WaitForDataCenter < Actions::Fusor::FusorBaseAction
          include Actions::Base::Polling

          input_format do
            param :deployment_id
          end

          def humanized_name
            _("Wait for Virtualization Data Center")
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def done?
            external_task
          end

          def poll_intervals
            # It takes almost 7 minutes to do the rpm installation via puppet,
            # so no point in spinning our wheels trying to see if the datacenter
            # is up yet. Also, another 22 minutes of "other" activitties after
            # the last rpm is installed before the datacenter can be checked.
            #
            # So reversing the polling intervals so that dynflow will wait 6
            # minutes before doing the second check. After the first interval
            # checks fail, it will speed them up as it takes longer. This should
            # minimize the number of polling actions we do on the datacenter and
            # reduce the noise in the logs.
            #
            # 6m, 4m, 1m, 30s, 8s, 4s, 1s, .5s
            [360, 240, 60, 30, 8, 4, 1, 0.5]
          end

          def invoke_external_task
            is_up? get_status(input[:deployment_id])
          end

          def poll_external_task
            is_up? get_status(input[:deployment_id])
          end

          private

          def get_status(deployment_id)
            ::Fusor.log.info "================ Rhev::WaitForDataCenter get_status method ===================="

            # If the api_host ip is available, use it to check the status of the data center.
            # If it isn't available, it is likely that the puppet facts have not been uploaded,
            # yet; therefore, skip checking the status until the next interval.
            deployment = ::Fusor::Deployment.find(deployment_id)

            api_host = deployment.rhev_engine_host.ip
            fail _("API Host not found") if api_host.nil?
            ::Fusor.log.debug "Using host address #{api_host}"
            unless api_host.blank?
              script_dir = "/usr/share/fusor_ovirt/bin/"
              api_user = "admin@internal"
              api_password = deployment.rhev_engine_admin_password
              # if db name is empty or nil, use Default
              data_center = deployment.rhev_data_center_name.to_s[/.+/m] || "Default"

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
