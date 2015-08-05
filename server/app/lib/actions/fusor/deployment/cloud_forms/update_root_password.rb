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
require 'stringio'

module Actions
  module Fusor
    module Deployment
      module CloudForms
        class UpdateRootPassword < Actions::Base
          def humanized_name
            _("Update Root Password on CloudForms Appliance")
          end

          def plan(deployment, vm_ip)
            plan_self(deployment_id: deployment.id,
                      vm_ip: vm_ip)
          end

          def run
            Rails.logger.info "================ UpdateRootPassword run method ===================="

            ssh_user = "root"
            ssh_password = "smartvm"

            deployment = ::Fusor::Deployment.find(input[:deployment_id])

            # TODO: observing issues with running the appliance console using SSHConnection; therefore, temporarily
            # commenting out and using the approach above which will run it from a python script
            @io = StringIO.new
            client = Utils::Fusor::SSHConnection.new(input[:vm_ip], ssh_user, ssh_password)
            client.on_complete(lambda { update_root_password_completed })
            client.on_failure(lambda { update_root_password_failed })
            cmd = "echo \"#{deployment.cfme_root_password}\" | passwd --stdin #{ssh_user}"
            client.execute(cmd, @io)

            Rails.logger.info "================ Leaving UpdateRootPassword run method ===================="
          end

          # TODO: temporarily commenting out the SSHConnection callbacks.  See above.
          def update_root_password_completed
            Rails.logger.warn "XXX the appliance console successfully ran on the node"
            if @io.string.include? "passwd: all authentication tokens updated successfully."
              Rails.logger.info @io.string
            else
              Rails.logger.error @io.string
            end
            @io.close
          end

          def update_root_password_failed
            Rails.logger.error @io.string
            @io.close
            fail _("Failed to update root password on appliance")
          end
        end
      end
    end
  end
end
