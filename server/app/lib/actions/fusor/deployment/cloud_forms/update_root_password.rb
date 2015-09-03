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
            begin

              ssh_user = "root"
              ssh_password = "smartvm"

              deployment = ::Fusor::Deployment.find(input[:deployment_id])

              @success = false
              @retry = false
              @io = StringIO.new
              client = Utils::Fusor::SSHConnection.new(input[:vm_ip], ssh_user, ssh_password)
              client.on_complete(lambda { update_root_password_completed })
              client.on_failure(lambda { update_root_password_failed })
              cmd = "echo \"#{deployment.cfme_root_password}\" | passwd --stdin #{ssh_user}"
              client.execute(cmd, @io)

              # close the stringio at the end
              @io.close unless @io.closed?

              # retry if necessary
              sleep_seconds = 20
              if !@success && @retry
                Rails.logger.info "UpdateRootPassword will retry again once in #{sleep_seconds}."

                # pause for station identification, actually pausing to give
                # cfme time to start ssh or whatever caused the original timeout
                # to be ready for use
                sleep sleep_seconds

                @io = StringIO.new
                client.execute(cmd, @io)
                if !@success
                  # if retry didn't work, we're done
                  fail _("Failed to update root password on appliance, after a retry. Error message: #{@io.string}")
                end
                @io.close unless @io.closed?
              end
            rescue Exception => e
              @io.close if @io && !@io.closed?
              fail _("Failed to update root password on appliance. Error message: #{e.message}")
            end
            Rails.logger.info "================ Leaving UpdateRootPassword run method ===================="
          end

          def update_root_password_completed
            Rails.logger.debug "=========== completed entered ============="
            if @io.string.include? "passwd: all authentication tokens updated successfully."
              @success = true
              @retry = false
              Rails.logger.info "Password updated successfully. #{@io.string}"
            else
              @success = false
              Rails.logger.error "Password was not updated. Error: #{@io.string}"
            end
            Rails.logger.debug "=========== completed exited ============="
          end

          def update_root_password_failed
            Rails.logger.debug "=========== failed entered ============="
            if !@success
              if @io.string.include? "execution expired"
                @retry = true
              end
              # SSH connection assumes if something is written to stderr it's a
              # problem. We only care about that if we actually failed.
              Rails.logger.error "Probable error. Will we retry? #{@retry}. Error message: #{@io.string}"
            end
            Rails.logger.debug "=========== failed exited ============="
          end
        end
      end
    end
  end
end
