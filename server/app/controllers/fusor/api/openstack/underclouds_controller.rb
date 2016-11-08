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

require 'net/ssh'
require 'timeout'
require 'socket'
require 'ipaddr'

module Fusor
  module Api
    module Openstack
      class UndercloudsController < Api::Openstack::BaseController

        resource_description do
          name 'Undercloud'
          desc 'Connect a deployment to an OpenStack undercloud and perform operations'
          api_version 'fusor_v21'
          api_base_url '/fusor/api/openstack/deployments/:deployment_id'
        end

        api :GET, '/undercloud', 'Show the undercloud deployment status'
        param :deployment_id, Integer, desc: 'ID of the deployment'
        def show
          render :json => get_undercloud_status_hash
        end

        api :POST, '/undercloud', 'Connect to the undercloud via SSH and link to the deployment using admin account'
        param :deployment_id, Integer, desc: 'ID of the deployment'
        def create
          underhost = params[:undercloud_host]
          underuser = params[:undercloud_user]
          underpass = params[:undercloud_password]

          begin
            ssh = Net::SSH.start(underhost, underuser, :password => underpass, :timeout => 2,
                                 :auth_methods => ["password"], :number_of_password_prompts => 0,
                                 :paranoid => false)
          rescue Exception => e
            error_message =
              if e.class == SocketError && e.message.match(/getaddrinfo: Name or service not known/)
                "Unable to resolve host #{underhost} for SSH"
              elsif e.class == Timeout::Error
                "Timed out while attempting to SSH to host #{underhost}"
              else
                "[#{e.class.name}] #{e.message}"
              end
            return render json: {errors: error_message}, status: 422
          end

          begin
            admin_raw = ssh.exec!('hiera admin_password')
            ip_addr_raw = ssh.exec!('hiera controller_host')
            ssh.close
            admin = admin_raw.strip
            ip_addr = ip_addr_raw.strip

            # This is deplorable, but the undercloud services only listen on the
            # provisioning network, which may or may not be accessible from here.
            # See if it is, and if not then throw an error saying so and suggesting
            # a possible workaround.
            # See bug https://bugzilla.redhat.com/show_bug.cgi?id=1255412
            routable = tcp_pingable?(ip_addr)
            if !routable
              render(json: {errors: "Error: The Undercloud is not accessible. Please check that the address specified"\
                     " is your Undercloud's provisioning interface, you have logged in and run fusor-undercloud-installer"\
                     " on the Undercloud, and that it can be reached by your RHCI server."}, status: 422)
              #system('sudo route add ' + ip_addr + ' via ' + underhost)
            else
              @deployment.openstack_deployment.undercloud_admin_password = admin
              @deployment.openstack_deployment.undercloud_ip_address = ip_addr
              @deployment.openstack_deployment.undercloud_ssh_username = underuser
              @deployment.openstack_deployment.undercloud_ssh_password = underpass
              @deployment.openstack_deployment.save(:validate => false)
              render :json => {:undercloud => @deployment.id}
            end
          rescue Exception => e
            render json: {errors: "[#{e.class.name}] #{e.message}"}, status: 422
          end
        end

        api :POST, '/undercloud/update_dns', 'Change undercloud DNS settings to match the DNS on this Satellite server'
        def update_dns
          result = Utils::Fusor::OpenstackDNS.new(@deployment.openstack_deployment).update
          if result
            render :json => get_undercloud_status_hash
          else
            render(json: {errors: "Failed to update DNS settings"}, status: 500)
          end
        end

        private

        def get_undercloud_status_hash
          deployed = !@deployment.openstack_deployment.undercloud_admin_password.empty?
          undercloud_dns = nil
          overcloud_dns = nil
          satellite_dns = nil

          if deployed
            overcloud_dns_utils = Utils::Fusor::OpenstackDNS.new(@deployment.openstack_deployment)
            undercloud_dns = overcloud_dns_utils.undercloud_dns
            overcloud_dns = overcloud_dns_utils.overcloud_dns
            satellite_dns = overcloud_dns_utils.satellite_dns
          end

          return {
            :deployed => deployed,
            :undercloud_dns => undercloud_dns,
            :overcloud_dns => overcloud_dns,
            :satellite_dns => satellite_dns
          }
        end

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
              rescue StandardError => err
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
