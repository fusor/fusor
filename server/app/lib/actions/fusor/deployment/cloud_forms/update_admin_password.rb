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
        class UpdateAdminPassword < Actions::Base
          def humanized_name
            _("Update Admin Password on CloudForms Appliance")
          end

          def plan(deployment, vm_ip)
            plan_self(deployment_id: deployment.id,
                      vm_ip: vm_ip)
          end

          def run
            Rails.logger.info "================ UpdateAdminPassword run method ===================="
            begin

              ssh_user = "root"
              deployment = ::Fusor::Deployment.find(input[:deployment_id])
              ssh_password = deployment.cfme_root_password
              upload_script(deployment, input[:vm_ip])

              @io = StringIO.new
              client = Utils::Fusor::SSHConnection.new(input[:vm_ip], ssh_user, ssh_password)
              cmd = "ruby /root/update_cfme_admin_passwd.rb #{deployment.cfme_admin_password}"
              client.execute(cmd, @io)

              # close the stringio at the end
              @io.close unless @io.closed?

            rescue Exception => e
              @io.close if @io && !@io.closed?
              fail _("Failed to update admin password on appliance. Error message: #{e.message}")
            end
            Rails.logger.info "================ Leaving UpdateAdminPassword run method ===================="
          end

          def upload_script(deployment, vm_ip)
            Net::SCP.start(vm_ip, "root", :password => deployment.cfme_root_password, :paranoid => false) do |scp|
              scp.upload!("/usr/share/fusor_ovirt/bin/update_cfme_admin_passwd.rb", "/root")
            end
          end
        end
      end
    end
  end
end
