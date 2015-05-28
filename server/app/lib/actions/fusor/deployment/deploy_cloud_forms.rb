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

        def finalize
          Rails.logger.warn "XXX ================ Deploy CFME finalize method ===================="

          deployment_id = input.fetch(:deployment_id)

          deployment = ::Fusor::Deployment.find(deployment_id)

          if is_rhev_up()
            status, output = upload_image(deployment.cfme_install_loc)
            if status > 0
              Rails.logger.warn "XXX image uploaded"
            else
              Rails.logger.error "XXX There was a problem with running the command. Status: #{status}. \nOutput: #{output}"
            end
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

        def add_rhev_provider
          # not sure if this will be needed, will requier calling out to a
          # script
        end

      end
    end
  end
end
