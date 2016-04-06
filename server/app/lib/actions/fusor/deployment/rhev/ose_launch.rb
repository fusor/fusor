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
      module Rhev
        #Setup and Launch OSE VM
        class OseLaunch < Actions::Fusor::FusorBaseAction
          def humanized_name
            _('Setup and Launch OSE VM')
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.info '====== OSE Launch run method ======'
            deployment = ::Fusor::Deployment.find(input[:deployment_id])

            # launch master nodes
            for i in 1..deployment.openshift_number_master_nodes do
              vmlauncher = Utils::Fusor::VMLauncher.new(deployment,
                                                        'ose',
                                                        deployment.openshift_install_loc,
                                                        'RedHat 7.1',
                                                        'x86_64')
              vmlauncher.set_hostname("#{deployment.label.tr('_', '-')}-ose-master#{i}")

              host = vmlauncher.launch_openshift_vm(deployment.openshift_master_vcpu,
                                                    deployment.openshift_master_ram,
                                                    deployment.openshift_master_disk,
                                                    deployment.openshift_storage_size)
              if host.nil?
                fail _("====== Launch OSE Master #{i} VM FAILED! ======")
              else
                deployment.ose_master_hosts << host
                ::Fusor.log.debug "====== OSE Launched VM Name : #{host.name} ======"
                ::Fusor.log.debug "====== OSE Launched VM IP   : #{host.ip}   ======"
              end
            end
            subdomain = Net::DNS::ARecord.new({:ip => host.ip,
                                               :hostname => "*.#{deployment.openshift_subdomain_name}.#{Domain.find(host.domain_id)}",
                                               :proxy => Domain.find(1).proxy
                                             })
            if subdomain.valid?
              ::Fusor.log.debug "====== OSE wildcard subdomain is not valid, it might conflict with a previous entry. Skipping. ======"
            else
              subdomain.create
              ::Fusor.log.debug "====== OSE wildcard subdomain created successfully ======"
            end

            # launch worker nodes
            for i in 1..deployment.openshift_number_worker_nodes do
              vmlauncher = Utils::Fusor::VMLauncher.new(deployment,
                                                        'ose',
                                                        deployment.openshift_install_loc,
                                                        'RedHat 7.1',
                                                        'x86_64')
              vmlauncher.set_hostname("#{deployment.label.tr('_', '-')}-ose-node#{i}")

              host = vmlauncher.launch_openshift_vm(deployment.openshift_node_vcpu,
                                                    deployment.openshift_node_ram,
                                                    deployment.openshift_node_disk,
                                                    deployment.openshift_storage_size)
              if host.nil?
                fail _("====== Launch OSE Worker #{i} VM FAILED! ======")
              else
                deployment.ose_worker_hosts << host
                ::Fusor.log.debug "====== OSE Launched VM Name : #{host.name} ======"
                ::Fusor.log.debug "====== OSE Launched VM IP   : #{host.ip}   ======"
              end
            end

            #TODO: Need to revisit and remove these hardcoded values.
            # https://trello.com/c/sSVPuP8b

            username = 'root'
            password = 'dog8code'

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
            ::Fusor.log.info '====== Leaving OSE Launch run method ======'
          end

          private

          def check_ssh(host, user, password)
            cmd = "echo tes-ssh"
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
