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

module Actions::Fusor::Deployment::OpenStack
  class SshCommand < Actions::Base
    def humanized_name
      _("SSH and run an arbitrary command on the Undercloud")
    end

    def plan(deployment, cmd)
      plan_self(deployment_id: deployment.id,
                cmd: cmd)
    end

    def run
      Rails.logger.debug "================ SshCommand run method ===================="

      deployment = ::Fusor::Deployment.find(input[:deployment_id])

      ssh_host = deployment.openstack_undercloud_ip_addr
      ssh_username = deployment.openstack_undercloud_user
      ssh_password = deployment.openstack_undercloud_user_password

      client = Utils::Fusor::SSHConnection.new(ssh_host, ssh_username, ssh_password)
      client.on_complete(lambda { ssh_command_completed })
      client.on_failure(lambda { ssh_command_failed })
      client.execute(input[:cmd])

      Rails.logger.debug "================ Leaving SshCommand run method ===================="
    end

    def ssh_command_completed
      Rails.logger.info "Command succeeded: " + input[:cmd]
    end

    def ssh_command_failed
      fail _("Command failed: " + input[:cmd])
    end
  end
end
