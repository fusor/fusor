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
        class UpdateRootPassword < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Update Root Password on CloudForms Appliance")
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.debug "================ UpdateRootPassword run method ===================="
            begin

              ::Fusor.log.info("Updating CFME password...")

              ssh_user = "root"
              ssh_password = "smartvm"

              deployment = ::Fusor::Deployment.find(input[:deployment_id])
              cfme_address = deployment.cfme_address
              @success = false
              @retry = false
              @retries = 30
              @io = StringIO.new
              client = Utils::Fusor::SSHConnection.new(cfme_address, ssh_user, ssh_password)
              client.on_complete(lambda { update_root_password_completed })
              client.on_failure(lambda { update_root_password_failed })
              cmd = "echo \"#{deployment.cfme_root_password}\" | passwd --stdin #{ssh_user}"
              client.execute(cmd, @io)

              # close the stringio at the end
              @io.close unless @io.closed?

              # retry if necessary
              sleep_seconds = 30
              while !@success && @retry
                ::Fusor.log.info "UpdateRootPassword will retry again in #{sleep_seconds} seconds."

                # pause for station identification, actually pausing to give
                # cfme time to start ssh or whatever caused the original timeout
                # to be ready for use
                sleep sleep_seconds

                @io = StringIO.new
                client.execute(cmd, @io)
                if !@success
                  @io.close unless @io.closed?
                end
              end
            rescue Exception => e
              @io.close if @io && !@io.closed?
              fail _("Failed to update root password on appliance. Error message: #{e.message}")
            else
              if !@success && @retries <= 0
                fail _("Failed to update root password on appliance. Retries exhausted. Error: #{@io.string}")
              elsif !@success
                fail _("Failed to update root password on appliance. Unhandled error: #{@io.string}")
              end
            ensure
              @io.close unless @io.closed?
            end
            ::Fusor.log.debug "================ Leaving UpdateRootPassword run method ===================="
          end

          def update_root_password_completed
            ::Fusor.log.debug "=========== completed entered ============="
            if @io.string.include? "passwd: all authentication tokens updated successfully."
              @success = true
              @retry = false
              ::Fusor.log.info "Password updated successfully. #{@io.string}"
            else
              @success = false
              ::Fusor.log.error "Password was not updated. Error: #{@io.string}"
            end
            ::Fusor.log.debug "=========== completed exited ============="
          end

          def update_root_password_failed
            ::Fusor.log.debug "=========== failed entered ============="
            @retries -= 1
            if !@success && @retries >= 0
              @retry = true
            else
              @retry = false
              # SSH connection assumes if something is written to stderr it's a
              # problem. We only care about that if we actually failed.
              ::Fusor.log.error "Probable error. Will we retry? #{@retry}. Error message: #{@io.string}"
            end
            ::Fusor.log.debug "=========== failed exited ============="
          end
        end
      end
    end
  end
end
