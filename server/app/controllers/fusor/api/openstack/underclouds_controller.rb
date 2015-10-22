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
require 'timeout'
require 'socket'
require 'ipaddr'

module Fusor
  module Api
    module Openstack
      class UndercloudsController < Api::Openstack::BaseController

        def show
          dep_has_password = (!@deployment.openstack_undercloud_password.nil? && !@deployment.openstack_undercloud_password.empty?)
          render :json => {:deployed => dep_has_password,
                           :failed => !dep_has_password}
        end

        def create
          underhost = params[:underhost]
          underuser = params[:underuser]
          underpass = params[:underpass]

          ssh = Egon::Undercloud::SSHConnection.new(underhost, underuser, underpass)
          io = StringIO.new
          ssh.execute("sudo hiera admin_password", io)
          admin = io.string.strip
          if admin.include?('failed') || admin.include?('error') || admin.include?('fingerprint')
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
            routable = tcp_pingable?(ip_addr)
            if !routable
              render(json: {errors: "Error: The Undercloud is not accessible. Please check that" + ip_addr +
                     "is your Undercloud's provisioning interface, you have logged in and run fusor-undercloud-installer"\
                     " on the Underlcoud, and that it can be reached by your RHCI server."}, status: 422)
              #system('sudo route add ' + ip_addr + ' via ' + underhost)
            else
              @deployment.openstack_undercloud_password = admin
              @deployment.openstack_undercloud_ip_addr = ip_addr
              @deployment.openstack_undercloud_user = underuser
              @deployment.openstack_undercloud_user_password = underpass
              @deployment.save(:validate => false)
              render :json => {:undercloud => @deployment.id}
            end
          end
        end

        private

        def tcp_pingable?(ip)
          # This code is from net-ping, and stripped down for use here
          # We don't need all the ldap dependencies net-ping brings in

          @service_check = true
          @port          = 80
          @timeout       = 1
          @exception     = nil
          bool           = false
          tcp            = nil

          begin
            Timeout.timeout(@timeout) do
              begin
                tcp = TCPSocket.new(ip, @port)
              rescue Errno::ECONNREFUSED => err
                if @service_check
                  bool = false
                else
                  @exception = err
                end
              rescue StandardError? => err
                @exception = err
              else
                bool = true
              end
            end
          rescue Timeout::Error => err
            @exception = err
          ensure
            tcp.close if tcp
          end

          bool
        end
      end
    end
  end
end
