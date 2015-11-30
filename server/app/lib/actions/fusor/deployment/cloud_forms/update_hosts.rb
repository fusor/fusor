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
require 'net/scp'

module Actions
  module Fusor
    module Deployment
      module CloudForms
        class UpdateHosts < Actions::Base
          def humanized_name
            _("Update /etc/hosts on CloudForms Appliance")
          end

          def plan(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            Rails.logger.info "================ UpdateHosts run method ===================="
            begin

              ssh_user = "root"
              deployment = ::Fusor::Deployment.find(input[:deployment_id])
              cfme_address = deployment.cfme_address
              ssh_password = deployment.cfme_root_password

              @io = StringIO.new
              client = Utils::Fusor::SSHConnection.new(cfme_address, ssh_user, ssh_password)
              cmd = 'echo "127.0.0.1 $(uname -n)" >> /etc/hosts'
              client.execute(cmd, @io)

              # close the stringio at the end
              @io.close unless @io.closed?

            rescue Exception => e
              @io.close if @io && !@io.closed?
              fail _("Failed to update /etc/hosts on appliance. Error message: #{e.message}")
            end
            Rails.logger.info "================ Leaving UpdateHosts run method ===================="
          end

        end
      end
    end
  end
end
