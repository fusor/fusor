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
      class DeployCloudForms < Actions::Base
        def humanized_name
          _("Deploy CloudForms Management Engine")
        end

        def plan(deployment, repository, image_file_name)
          Rails.logger.warn "XXX ================ Planning CFME Deployment ===================="

          fail _("CloudForms repository has not been provided.") unless repository

          # VERIFY PARAMS HERE
          #if deployment.deploy_cfme
          #  fail _("Unable to locate a CFME Engine Host") unless deployment.rhev_engine_host
          #end

          plan_self(deployment_id: deployment.id, repository_id: repository.id, image_file_name: image_file_name)
        end

        def run
          Rails.logger.warn "XXX ================ Deploy CFME finalize method ===================="

          deployment = ::Fusor::Deployment.find(input[:deployment_id])
          repository = ::Katello::Repository.find(input[:repository_id])

          if is_rhev_up
            # copy the cfme to the rhev host
            # host should be deployment
            puts "XXX scp file"
            Rails.logger.warn "XXX scp file"

            # need rhev-engine host id
            api_host = "10.8.101.181" # deployment.rhev_engine_host.facts['ipaddress']
            root_password = "dog8code" # deployment.rhev_root_password
            scp_image_file(api_host, root_password, find_image_file(repository, input[:image_file_name]))

            puts "XXX scp file DONE"
            Rails.logger.warn "XXX scp file DONE"

            status, output = upload_image(deployment)
            if status > 0
              Rails.logger.warn "XXX image uploaded"
            else
              Rails.logger.error "XXX There was a problem with running the command. Status: #{status}. \nOutput: #{output}"
            end

            status, output = import_template()
            if status > 0
              Rails.logger.warn "XXX image uploaded"
            else
              Rails.logger.error "XXX There was a problem with running the command. Status: #{status}. \nOutput: #{output}"
            end

            # TODO: the following call needs to pass in the IP address of the cloudforms VM that is created above
            #add_rhev_provider(deployment, "10.8.101.247")
          end

          Rails.logger.warn "XXX #{deployment.id}"

          Rails.logger.warn "XXX ================ Leaving CFME  finalize method ===================="
        end

        private

        def is_rhev_up(deployment)
          api_user = "admin@internal"
          api_password = "dog8code" # deployment.rhev_engine_admin_password
          api_host = "10.8.101.181" # deployment.rhev_engine_host.facts['ipaddress']
          data_center = "Default" # not sure if this comes from some place or not

          cmd = "ovirt_get_datacenter_status.py --api_user #{api_user} --api_host #{api_host} --api_pass #{api_password} --data_center #{data_center}"
          status, output = run_command(cmd)

          if status == 0 and "up" == output.first.rstrip
            return true
            # thought about failing if it isn't up, but figured I'll let the
            # caller fail if this returns false
          end

          return false
        end

        # TODO: fill in appropriate parameters for each of these commands
        def create_vm_from_template()
          cmd = "ovirt_create_vm_from_template.py --api_host 10.8.101.181 --api_pass dog8code --vm_template_name jwm_cfme-rhevm-5.3-47_1432673130.7 --cluster_name \"Default\" --vm_name jwm_may29_13_09m"
          return run_command(cmd)
        end

        def add_disk_to_vm
          cmd ="ovirt_add_disk_to_vm.py --api_host 10.8.101.181 --api_pass dog8code --size_gb 20 --storage_domain VMs --vm_id 76659ab3-d431-4542-bda1-6dac2e04060a"
          return run_command(cmd)
        end

        def start_vm
          cmd = "ovirt_start_vm.py  --api_host 10.8.101.181 --api_pass dog8code  --vm_id 76659ab3-d431-4542-bda1-6dac2e04060a"
          return run_command(cmd)
        end

        def get_vm_ip
          cmd = "ovirt_get_ip_of_vm.py  --api_host 10.8.101.181 --api_pass dog8code  --vm_id 76659ab3-d431-4542-bda1-6dac2e04060a"
          return run_command(cmd)
        end

        def run_command(cmd)
          status, output = Utils::Fusor::ComandUtils.run_command(cmd)
          puts status
          puts output
          return status, output
        end

        # TODO : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

        def upload_image(deployment)
            # -N new image name
            # -e export domain TODO: where do we get the export domain
            # -v verbose
            # -m do not remove network interfaces from image
            #
            # # ssh to engine node and upload the image in the home directory
            # # engine-image-uploader -N cfme-rhevm-5.3-47 -e export -v -m upload ./cfme-rhevm-5.3-47.x86_64.rhevm.ova
            # engine_image_upload_cmd = "engine-image-uploader -u %s -p \'%s\' -N %s -e %s -m upload ~/%s" % (username, password, imported_template_name, export_domain_name, cfme_image_file)
            # cmd = "ssh root@%s -o \'StrictHostKeyChecking no\' -C '%s'" % (ip, engine_image_upload_cmd)
            # status, out, err = run_command(cmd)
            # if status:
            #    print "Error running:  %s" % (cmd)
            #    print err
            #    sys.exit()

            imported_template_name = "cfme-rhevm-5.3-47-#{Time.now.to_i}"
            username = "admin@internal"
            password = "dog8code" # deployment.rhev_engine_admin_password
            api_host = "10.8.101.181" # deployment.rhev_engine_host.facts['ipaddress']
            ssh_username = "root"
            ssh_password = "dog8code" # deployment.rhev_root_password
            export_domain_name =  "export"
            cfme_image_file = "/root/cfme-rhevm-5.3-47.x86_64.rhevm.ova" # can't use find_image_file without doing filename magic :(

            # NOTE: the image file found locally is DIFFERENT than the one on
            # the rhev engine host.
            cmd = "/usr/bin/engine-image-uploader -u #{username} -p \'#{password}\' -N #{imported_template_name} -e #{export_domain_name} -v -m upload #{cfme_image_file}"
            # RHEV-host username password
            puts "XXX connecting to host"
            #client = Utils::Fusor::SSHConnection.new(deployment.rhev_engine_host, username, password)
            client = Utils::Fusor::SSHConnection.new(api_host, ssh_username, ssh_password)
            client.on_complete(lambda { ssh_completed })
            client.on_failure(lambda { ssh_failed })


            puts "XXX we're going to run [#{cmd}]"
            Rails.logger.warn "XXX we're going to run [#{cmd}]"

            return client.execute(cmd)
        end

        def import_template(deployment)
          api_user = "admin@internal"
          api_password = "dog8code" # deployment.rhev_engine_admin_password
          api_host = "10.8.101.181" # deployment.rhev_engine_host.facts['ipaddress']
          template_name = "#{deployment.name}-cfme-template"
          cmd = "ovirt_import_template.py --api_user '#{api_user}' --api_pass #{api_password} --api_host #{api_host} --vm_template_name #{template_name}"
          return run_command(cmd)
        end

        def apply_puppet_param(param, node)
          Rails.logger.warn "XXX applying #{param} on #{node}"
        end

        def run_appliance_console(host, ssh_user, ssh_password, db_password)
          Rails.logger.warn "XXX running the appliance console on the node"
          # use SSH command from the OSP code
          client = Utils::Fusor::SSHConnection.new(host, ssh_user, ssh_password)
          cmd = "appliance_console_cli --region 1 --internal --force-key -p #{db_password}"
          # need to deal with errors and return codes
          client.execute(cmd)
        end

        def is_cloudforms_up
          # possibly make a GET call to the webui
        end

        def add_rhev_provider(deployment, cfme_ip)
          provider = { :name => deployment.name,
                       :type => "rhevm",
                       :hostname => "deployment.rhev_engine_host.name",
                       :ip => "deployment.rhev_engine_host.ip",
                       :username => "admin@internal", # TODO: perhaps make configurable, in future
                       :password => "deployment.rhev_engine_admin_password"
                     }

          Utils::CloudForms::Provider.add(cfme_ip, provider)
        end

        def find_image_file(repository, image_file_name)
          images = ::Katello.pulp_server.extensions.repository.unit_search(repository.pulp_id)

          if image_file_name
            image_file = images.find{ |image| image[:metadata][:name] == image_file_name }
            image_file = image_file[:metadata][:_storage_path] if image_file
          else
            images = images.find_all{ |image| image[:metadata][:name].starts_with?("cfme-rhevm") }
            image_file = images.compact.sort_by{ |k| k[:name] }.last[:metadata][:_storage_path]
          end

          return image_file
        end

        def scp_image_file(rhev_host, password, image_file)
          # scp the cfme file over to the rhev host, assume root user
          Net::SCP.start(rhev_host, "root", :password => password) do |scp|
            scp.upload!(image_file, "/root")
          end
        end

        def ssh_completed
          puts "XXX ssh completed"
        end

        def ssh_failed
          puts "XXX ssh failed"
        end
      end
    end
  end
end
