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
require 'net/http'
require 'net/ssh'

module Actions
  module Fusor
    module Deployment
      module OpenShift
        class WaitForSshd < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Wait for SSH Service on OpenShift VMs")
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.debug "================ Wait for SSHD run method ===================="
            deployment = ::Fusor::Deployment.find(input[:deployment_id])

            username = 'root'
            password = deployment.openshift_root_password

            # wait for all the master nodes to fully boot with sshd available
            deployment.ose_master_hosts.each do |host|
              status = wait_for_sshd_on_host(host.name, username, password)
              fail _("====== Could not ssh into #{host.name}!") unless status.eql?(true)
            end

            # wait for all the worker nodes to fully boot with sshd available
            deployment.ose_worker_hosts.each do |host|
              status = wait_for_sshd_on_host(host.name, username, password)
              fail _("====== Could not ssh into #{host.name}!") unless status.eql?(true)
            end
          end

          private

          def check_ssh(host, user, password)
            cmd = "echo test-ssh"
            begin
              ssh = Net::SSH.start(host, user, :password => password, :timeout => 2,
                                   :auth_methods => ["password"],
                                   :number_of_password_prompts => 0, :paranoid => false)
              ssh.exec!(cmd)
              ssh.close
              return true
            rescue
              ::Fusor.log.debug "====== Unable to make SSH connection to #{host} ====== "
              return false
            end
          end

          def wait_for_sshd_on_host(host, username, password)
            max_tries = 60
            wait_time = 60
            count = 0
            while count < max_tries
              if check_ssh(host, username, password)
                ::Fusor.log.debug "====== ssh connection SUCCESS on #{host}!"
                return true
              else
                ::Fusor.log.debug "====== Trying (#{count + 1}/#{max_tries}): ssh was NOT available on #{host} yet. ======"
                sleep(wait_time)
                count += 1
              end
            end
            ::Fusor.log.error "====== waiting for ssh on #{host} TIMED OUT! ======"
            return false
          end
        end
      end
    end
  end
end
