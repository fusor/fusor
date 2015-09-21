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

require 'egon/undercloud/ssh-connection'

module Fusor
  module Api
    module Openstack
      class UndercloudsController < Api::Openstack::BaseController

        def show
          deployment = Deployment.find(params[:id])
          dep_has_password = (!deployment.openstack_undercloud_password.nil? && !deployment.openstack_undercloud_password.empty?)
          render :json => {:deployed => dep_has_password,
                           :failed => !dep_has_password}
        end

        def create
          deployment = Deployment.find(params[:deployment_id])
          underhost = params[:underhost]
          underuser = params[:underuser]
          underpass = params[:underpass]

          ssh = Egon::Undercloud::SSHConnection.new(underhost, underuser, underpass)
          io = StringIO.new
          ssh.execute("sudo hiera admin_password", io)
          admin = io.string.strip
          if admin.include?('failed') || admin.include?('error')
            render json: {errors: admin}, status: 422
          else
            io = StringIO.new
            ssh.execute("sudo hiera controller_host", io)
            ip_addr = io.string.strip

            # This is deplorable, but the undercloud services only listen on the
            # provisioning network, which may or may not be accessible from here.
            # See if it is, and if not then throw an error saying so and suggesting
            # a possible workaround.
            # See bug https://bugzilla.redhat.com/show_bug.cgi?id=1255412
            routable = system("ping " + ip_addr + " -c 1 -W 1")
            if !routable
              render(json: {errors: "Error: The Undercloud's provisioning network is not routable. Please run 'ip route add " + ip_addr + ' via ' + underhost + "' as root on the Satellite and try again."},
                     status: 422)
              #system('sudo route add ' + ip_addr + ' via ' + underhost)
            else
              deployment.openstack_undercloud_password = admin
              deployment.openstack_undercloud_ip_addr = ip_addr
              deployment.openstack_undercloud_user = underuser
              deployment.openstack_undercloud_user_password = underpass
              deployment.save(:validate => false)
              render :json => {:undercloud => deployment.id}
            end
          end
        end

      end
    end
  end
end
