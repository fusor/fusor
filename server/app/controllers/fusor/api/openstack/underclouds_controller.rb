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

require 'egon/undercloud/commands'
require 'egon/undercloud/ssh-connection'
require 'egon/undercloud/installer'

module Fusor
  module Api
    module Openstack
      class UndercloudsController < Api::Openstack::BaseController

        def wait_and_log(installer, stringio)
          lastpos = 0
          while !installer.completed?
            sleep 1
            current = stringio.size
            if (lastpos != current)
              stringio.seek(lastpos)
              Rails.logger.info stringio.read(current - lastpos)
              lastpos = current
            end
          end
        end

        def show
          deployment = Deployment.find(params[:id])
          render :json => {:deployed => deployment.undercloud_deployed,
                           :failed => deployment.undercloud_failed}
        end

        def create
          deployment = Deployment.find(params[:deployment_id])

          # TODO: will be moved into an action
          t = Thread.new {
            underhost = params[:underhost]
            underuser = params[:underuser]
            underpass = params[:underpass]
            satellite_url = params[:satellite_url]
            satellite_org = params[:satellite_org]
            satellite_key = params[:satellite_key]

            ssh = Egon::Undercloud::SSHConnection.new(underhost, underuser, underpass)
            io = StringIO.new
            installer = Egon::Undercloud::Installer.new(ssh)
            installer.install(Egon::Undercloud::Commands.OSP7_satellite(satellite_url, satellite_org, satellite_key), io)
            wait_and_log(installer, io)
            deployment.undercloud_failed = installer.failure?
            Rails.logger.info "undercloud install complete"
            Rails.logger.info "installer.started? #{installer.started?}"
            Rails.logger.info "installer.completed? #{installer.completed?}"
            Rails.logger.info "undercloud install success? #{!installer.failure?}"

            if installer.failure?
              deployment.undercloud_deployed = true
              deployment.save
              return
            end

            installer.check_ports
            Rails.logger.info "undercloud check_ports success? #{!installer.failure?}"
            deployment.undercloud_failed = installer.failure?

            if installer.failure?
              deployment.undercloud_deployed = true
              deployment.save
              return
            end

            io = StringIO.new
            ssh.execute("sudo hiera admin_password", io)
            admin = io.string
            # TODO: save admin credentials, remove logging
            Rails.logger.info "TODO: remove admin password logging #{admin}"

            deployment.undercloud_deployed = true
            deployment.save
          }

          render :json => {:undercloud => deployment.id}
        end

      end
    end
  end
end
