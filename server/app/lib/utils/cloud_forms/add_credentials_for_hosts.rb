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
        Rails.logger.info "Starting - Adding Host credentials to the RHEV provider at #{cfme_ip}"
        begin
          ssh_username  = "root"
          ssh_password  = deployment.cfme_root_password
          host_username = "root"
          host_password = deployment.rhev_engine_admin_password
          script_name   = "add_host_credentials.rb"
          scp_from_path = "/usr/share/fusor_ovirt/bin"
          scp_to_path   = "/root"
          csv_file_name = "hosts_#{deployment.label}.csv"
          csv_file_path = "/tmp"

          # create the hosts csv file
          csv_file = open("#{csv_file_path}/#{csv_file_name}", 'a')
          csv_file.sync = true
          csv_file.puts "ip, hostname"
          hypervisor_hosts = deployment.rhev_hypervisor_hosts
          hypervisor_hosts.each do |hhost|
            csv_file.puts "#{hhost.ip}, #{hhost.name}"
          end
          csv_file.close

          # upload hosts csv file
          Net::SCP.start(cfme_ip, ssh_username, :password => ssh_password, :paranoid => false) do |scp|
            scp.upload!("#{csv_file_path}/#{csv_file_name}", "#{scp_to_path}/#{csv_file_name}")
          end

          # upload the script
          Net::SCP.start(cfme_ip, ssh_username, :password => ssh_password, :paranoid => false) do |scp|
            scp.upload!("#{scp_from_path}/#{script_name}", "#{scp_to_path}/#{script_name}")
          end

          @io = StringIO.new
          client = Utils::Fusor::SSHConnection.new(cfme_ip, ssh_username, ssh_password)

          # run the script
          cmd = "ruby #{scp_to_path}/#{script_name} #{deployment.label}-RHEV #{host_username} #{host_password} #{csv_file_name}"
          client.execute(cmd, @io)

          # close the stringio at the end
          @io.close unless @io.closed?

        rescue Exception => e
          @io.close if @io && !@io.closed?
          fail _("Failed to add host credentials. Error message: #{e.message}")
        end
        Rails.logger.info "Finished - Adding Host credentials to the RHEV provider at #{cfme_ip}"
      end
    end
  end
end
