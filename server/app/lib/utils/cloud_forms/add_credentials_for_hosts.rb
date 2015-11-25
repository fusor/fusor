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

module Utils
  module CloudForms
    class AddCredentialsForHosts
      def self.add(cfme_ip, deployment)
        Rails.logger.debug "Starting - Adding Host credentials to the RHEV provider at #{cfme_ip}"
        begin
          ssh_username  = "root"
          ssh_password  = deployment.cfme_root_password
          host_username = "root"
          host_password = deployment.rhev_engine_admin_password
          script_name   = "add_host_credentials.rb"
          scp_from_path = "/usr/share/fusor_ovirt/bin"
          scp_to_path   = "/root"

          # upload the script
          Net::SCP.start(cfme_ip, ssh_username, :password => ssh_password, :paranoid => false) do |scp|
            scp.upload!("#{scp_from_path}/#{script_name}", "#{scp_to_path}/#{script_name}")
          end

          @io = StringIO.new
          client = Utils::Fusor::SSHConnection.new(cfme_ip, ssh_username, ssh_password)

          # run the script
          cmd = "ruby #{scp_to_path}/#{script_name} #{deployment.name} #{host_username} #{host_password}"
          client.execute(cmd, @io)

          # close the stringio at the end
          @io.close unless @io.closed?

        rescue
          @io.close if @io && !@io.closed?
          fail _("Failed to add host credentials. Error message: #{e.message}")
        end
        Rails.logger.debug "Finished - Adding Host credentials to the RHEV provider at #{cfme_ip}"
      end
    end
  end
end
