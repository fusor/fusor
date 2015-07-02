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
        class IsUp < Actions::Base
          def humanized_name
            _("Is Virtualization Environment Up?")
          end

          def plan(deployment)
            plan_self(deployment_id: deployment.id,
                      user_id: ::User.current.id)
          end

          def run
            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            output[:is_up] = is_rhev_up(deployment)
          end

          private

          def is_rhev_up(deployment)
            script_dir = "/usr/share/fusor_ovirt/bin/"

            api_user = "admin@internal"
            api_password = deployment.rhev_engine_admin_password
            api_host = deployment.rhev_engine_host.facts['ipaddress']
            # if db name is empty or nil, use Default
            data_center = deployment.rhev_database_name.to_s[/.+/m] || "Default"

            cmd = "#{script_dir}ovirt_get_datacenter_status.py "\
                "--api_user #{api_user} "\
                "--api_host #{api_host} "\
                "--api_pass #{api_password} "\
                "--data_center #{data_center}"

            status, output = Utils::Fusor::CommandUtils.run_command(cmd)
            if status == 0 and "up" == output.first.rstrip
              return true
              # thought about failing if it isn't up, but figured I'll let the
              # caller fail if this returns false
            end

            return false
          end
        end
      end
    end
  end
end
