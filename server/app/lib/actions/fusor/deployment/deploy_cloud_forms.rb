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

        def plan(deployment)
          Rails.logger.warn "XXX ================ Planning CFME Deployment ===================="

          # VERIFY PARAMS HERE
          #if deployment.deploy_cfme
          #  fail _("Unable to locate a CFME Engine Host") unless deployment.rhev_engine_host
          #end

          plan_self deployment_id: deployment.id
        end

        def run
          Rails.logger.warn "XXX ================ Deploy CFME finalize method ===================="

          deployment_id = input.fetch(:deployment_id)

          deployment = ::Fusor::Deployment.find(deployment_id)

          if is_rhev_up()
            # copy the cfme to the rhev host
            # host should be deployment
            Rails.logger.warn "XXX scp file"
            scp_image_file("10.8.101.181", "dog8code", find_image_file())
            Rails.logger.warn "XXX scp file DONE"

            status, output = upload_image(deployment.cfme_install_loc)
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

        def is_rhev_up()
           # TODO: figure out how to detect if rhev is running.
           return true
        end

        def upload_image(location)
            # -N new image name
            # -e export domain TODO: where do we get the export domain
            # -v verbose
            # -m do not remove network interfaces from image
            #
            cmd = "/usr/bin/engine-image-uploader -N CloudForms-3.0-2014-08-12.2 -e export_domain1 -v -m upload #{location}"

            Rails.logger.warn "XXX we're going to run [#{cmd}]"

            # run_command returns: status, output
            return Utils::Fusor::CommandUtils.run_command(cmd)
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

        def find_image_file
          return "/tmp/cfme-rhevm-5.3-47.x86_64.rhevm.ova"
        end

        def scp_image_file(rhev_host, password, image_file)
          # scp the cfme file over to the rhev host, assume root user
          Net::SCP.start(rhev_host, "root", :password => password) do |scp|
            scp.upload!(image_file, "/root")
          end
        end
      end
    end
  end
end
