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

        def plan(deployment, repository, image_file_name = nil)
          Rails.logger.info "================ Planning CFME Deployment ===================="

          # if by some miracle we arrive here without having selected
          # deploy_cfme, log the warning and just return.
          if not deployment.deploy_cfme
            Rails.logger.warn "Deploy Cloud Forms scheduled but deploy_cfme was NOT selected. Please file a bug."
            return
          end

          fail _("CloudForms repository has not been provided.") unless repository

          # VERIFY PARAMS HERE
          if deployment.deploy_cfme
            fail _("Unable to locate a RHEV export domain") unless deployment.rhev_export_domain_name
            fail _("Unable to locate a suitable host for CloudForms deployment") unless deployment.rhev_engine_host
            fail _("RHEV engine admin password not configured properly") unless deployment.rhev_engine_admin_password
          end

          plan_self(deployment_id: deployment.id,
                    repository_id: repository.id,
                    image_file_name: image_file_name,
                    user_id: ::User.current.id)
        end

        def run
          Rails.logger.info "================ Deploy CFME run method ===================="

          # Note: user_id is being passed in and then used to set User.current to address an error
          # that could occur when we later attempt to access ::Katello.pulp_server indirectly through
          # this action.  In the future, we may want to see if there are alternatives to this approach.
          ::User.current = ::User.find(input[:user_id])

          deployment = ::Fusor::Deployment.find(input[:deployment_id])
          repository = ::Katello::Repository.find(input[:repository_id])
          @script_dir = "/usr/share/fusor_ovirt/bin/"

          if is_rhev_up(deployment)
            @api_host = deployment.rhev_engine_host.facts['ipaddress']

            image_full_path, image_file_name = find_image_details(repository, input[:image_file_name])
            scp_image_file(deployment, image_full_path)
            template_name = upload_image(deployment, image_file_name)
            import_template(deployment, template_name)

            vm_id = create_vm_from_template(deployment, template_name)
            add_disk_to_vm(deployment, vm_id)
            start_vm(deployment, vm_id)
            vm_ip = get_vm_ip(deployment, vm_id)

            #if is_cloudforms_up(vm_ip), I guess we want to wait for it to come
            #up instead of being a simple true/false
            run_appliance_console(deployment, vm_ip)
            add_rhev_provider(deployment, vm_ip)
          end

          Rails.logger.info "================ Leaving CFME run method ===================="
        ensure
          ::User.current = nil
        end

        private

        def is_rhev_up(deployment)
          api_user = "admin@internal"
          api_password = deployment.rhev_engine_admin_password
          api_host = deployment.rhev_engine_host.facts['ipaddress']
          # if db name is empty or nil, use Default
          data_center = deployment.rhev_database_name.to_s[/.+/m] || "Default"

          cmd = "#{@script_dir}ovirt_get_datacenter_status.py "\
                "--api_user #{api_user} "\
                "--api_host #{api_host} "\
                "--api_pass #{api_password} "\
                "--data_center #{data_center}"

          status, output = run_command(cmd)

          if status == 0 and "up" == output.first.rstrip
            return true
            # thought about failing if it isn't up, but figured I'll let the
            # caller fail if this returns false
          end

          return false
        end

        def create_vm_from_template(deployment, template_name)
          vm_name = "#{deployment.name}-cfme" # TODO: we may need to be more descriptive in the name of the VM

          cmd = "#{@script_dir}ovirt_create_vm_from_template.py "\
                "--api_host #{@api_host} "\
                "--api_pass #{deployment.rhev_engine_admin_password} "\
                "--vm_template_name #{template_name} "\
                "--cluster_name #{deployment.rhev_cluster_name} "\
                "--vm_name #{vm_name}"

          status, output = run_command(cmd)
          unless status == 0
            fail _("Unable to create virtual machine from template: %{output}") % { :output => output.join('; ') }
          end
          sleep 10 # TODO: pause for a few seconds so that the vm creation completes
          return output.first.rstrip # vm_id
        end

        def add_disk_to_vm(deployment, vm_id)
          storage_size = "20" # TODO: should this be configurable on the deployment?
          cmd = "#{@script_dir}ovirt_add_disk_to_vm.py "\
                "--api_host #{@api_host} "\
                "--api_pass #{deployment.rhev_engine_admin_password} "\
                "--size_gb #{storage_size} "\
                "--storage_domain #{deployment.rhev_storage_name} "\
                "--vm_id #{vm_id}"

          status, output = run_command(cmd)
          unless status == 0
            fail _("Unable to add disk to virtual machine: %{output}") % { :output => output.join('; ') }
          end
        end

        def start_vm(deployment, vm_id)
          cmd = "#{@script_dir}ovirt_start_vm.py "\
                "--api_host #{@api_host} "\
                "--api_pass #{deployment.rhev_engine_admin_password} "\
                "--vm_id #{vm_id}"

          status, output = run_command(cmd)
          unless status == 0
            fail _("Unable to start virtual machine: %{output}") % { :output => output.join('; ') }
          end
        end

        def get_vm_ip(deployment, vm_id)
          cmd = "#{@script_dir}ovirt_get_ip_of_vm.py "\
                "--api_host #{@api_host} "\
                "--api_pass #{deployment.rhev_engine_admin_password} "\
                "--vm_id #{vm_id}"

          status, output = run_command(cmd)
          unless status == 0
            fail _("Unable to get virtual machine ip address: %{output}") % { :output => output.join('; ') }
          end
          return output.first.rstrip # vm_ip
        end

        def upload_image(deployment, image_file_name)
          # ssh to engine node and upload the image in the home directory
          # engine-image-uploader -N cfme-rhevm-5.3-47 -e export -v -m upload ./cfme-rhevm-5.3-47.x86_64.rhevm.ova
          #
          # -N new image name
          # -e export domain TODO: where do we get the export domain
          # -v verbose
          # -m do not remove network interfaces from image

          imported_template_name = "#{deployment.name}-cfme-template"
          username = "admin@internal"
          ssh_username = "root"
          export_domain_name = deployment.rhev_export_domain_name

          cfme_image_file = "/root/#{image_file_name}" # can't use find_image_file without doing filename magic :(

          # NOTE: the image file found locally is DIFFERENT than the one on
          # the rhev engine host. Also note this uses /usr/bin/ because it is on
          # rhev engine NOT locally. Do not change this to @script_dir.
          cmd = "/usr/bin/engine-image-uploader "\
                "-u #{username} "\
                "-p \'#{deployment.rhev_engine_admin_password}\' "\
                "-N #{imported_template_name} "\
                "-e #{export_domain_name} "\
                "-v -m upload #{cfme_image_file}"

          # RHEV-host username password
          client = Utils::Fusor::SSHConnection.new(@api_host, ssh_username, deployment.rhev_root_password)
          client.on_complete(lambda { upload_image_completed })
          client.on_failure(lambda { upload_image_failed })
          client.execute(cmd)

          return imported_template_name
        end

        def upload_image_completed
          Rails.logger.info "image uploaded"
        end

        def upload_image_failed
          fail _("Unable to upload image")
        end

        def import_template(deployment, template_name)
          api_user = "admin@internal"
          cmd = "#{@script_dir}ovirt_import_template.py "\
                "--api_user '#{api_user}' "\
                "--api_pass #{deployment.rhev_engine_admin_password} "\
                "--api_host #{@api_host} "\
                "--cluster_name #{deployment.rhev_cluster_name} "\
                "--export_domain_name #{deployment.rhev_export_domain_name} " \
                "--storage_domain_name #{deployment.rhev_storage_name} "\
                "--vm_template_name #{template_name}"

          status, output = run_command(cmd)
          if status != 0
            fail _("Unable to import template: Status: %{status}. Output: %{output}") % { :status => status, :output => output }
          end
        end

        def apply_puppet_param(param, node)
          Rails.logger.warn "XXX applying #{param} on #{node}"
        end

        def run_appliance_console(deployment, vm_ip)
          Rails.logger.warn "XXX running the appliance console on the node"

          db_password = "changeme" # TODO: we may want to make this configurable in the future
          ssh_user = "root"
          #
          # JWM 6/9/2015, We are not yet setting the CloudForms VM root password
          # We need to use the default password of 'smartvm' until we add support.
          #
          ssh_password = "smartvm" # TODO: need to update to use deployment.cfme_root_password; however, that means it must also be set on VM during/after creation
          #ssh_password = deployment.cfme_root_password

          cmd = "#{@script_dir}miq_run_appliance_console.py "\
                "--miq_ip #{vm_ip} "\
                "--ssh_user #{ssh_user} "\
                "--ssh_pass #{ssh_password} "\
                "--db_password #{db_password}"

          status, output = run_command(cmd)
          if status == 0
            sleep 300
          else
            fail _("Unable to run appliance console: %{output}") % { :output => output.join('; ') }
          end

          # TODO: observing issues with running the appliance console using SSHConnection; therefore, temporarily
          # commenting out and using the approach above which will run it from a python script
          #client = Utils::Fusor::SSHConnection.new(vm_ip, ssh_user, ssh_password)
          #client.on_complete(lambda { run_appliance_console_completed })
          #client.on_failure(lambda { run_appliance_console_failed })
          #cmd = "appliance_console_cli --region 1 --internal --force-key -p #{db_password} --verbose"
          #client.execute(cmd)
        end

        # TODO: temporarily commenting out the SSHConnection callbacks.  See above.
        #def run_appliance_console_completed
        #  Rails.logger.warn "XXX the appliance console successfully ran on the node"
        #  puts "XXX the appliance console successfully ran on the node"
        #  sleep 300 # TODO: pause while the appliance web ui comes up...
        #end
        #
        #def run_appliance_console_failed
        #  fail _("Failed to run appliance console")
        #end

        def is_cloudforms_up(web_ip)
          # possibly make a GET call to the webui
          begin
            output = open(smart_add_url_protocol(web_ip), {ssl_verify_mode: OpenSSL::SSL::VERIFY_NONE})
            if output.status.first == "200"
                return true
            end
          rescue Exception => e
            Rails.logger.warn e
            return false
          end

          return false
        end

        def smart_add_url_protocol(url)
          unless url[/\Ahttp:\/\//] || url[/\Ahttps:\/\//]
            url = "https://#{url}"
          end
          return url
        end

        def add_rhev_provider(deployment, cfme_ip)
          provider = { :name => deployment.name,
                       :type => "rhevm",
                       :hostname => deployment.rhev_engine_host.name,
                       :ip => deployment.rhev_engine_host.ip,
                       :username => "admin@internal", # TODO: perhaps make configurable, in future
                       :password => deployment.rhev_engine_admin_password
                     }

          Utils::CloudForms::Provider.add(cfme_ip, provider)
        end

        def find_image_details(repository, image_file_name)
          images = ::Katello.pulp_server.extensions.repository.unit_search(repository.pulp_id)

          if image_file_name
            image_name = images.find{ |image| image[:metadata][:name] == image_file_name }
            image_path = image_file[:metadata][:_storage_path] if image_name
          else
            images = images.find_all{ |image| image[:metadata][:name].starts_with?("cfme-rhevm") }
            image_name = images.compact.sort_by{ |k| k[:name] }.last[:metadata][:name]
            image_path = images.compact.sort_by{ |k| k[:name] }.last[:metadata][:_storage_path]
          end

          return image_path, image_name
        end

        def scp_image_file(deployment, image_file)
          # scp the cfme file over to the rhev host, assume root user
          Net::SCP.start(@api_host, "root", :password => deployment.rhev_root_password) do |scp|
            scp.upload!(image_file, "/root")
          end
        end

        def run_command(cmd)
          Rails.logger.debug "Running: #{cmd}"
          status, output = Utils::Fusor::CommandUtils.run_command(cmd)
          Rails.logger.debug "Status: #{status}, output: #{output}"
          return status, output
        end
      end
    end
  end
end
