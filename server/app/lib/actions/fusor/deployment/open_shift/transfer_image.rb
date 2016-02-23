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
      module OpenShift
        class TransferImage < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Transfer RHEL Guest 7.2 image to Virtualization Environment")
          end

          def plan(deployment, image_file_name)
            super(deployment)
            plan_self(deployment_id:   deployment.id,
                      image_file_name: image_file_name)
          end

          def run
            ::Fusor.log.debug "================ TransferImage run method ===================="
            begin

              deployment = ::Fusor::Deployment.find(input[:deployment_id])

              from_image_path    = "/usr/share/#{input[:image_file_name]}/#{input[:image_file_name]}*/"
              from_tar_file_path = "/tmp"
              to_img_file_path   = "/root"
              tar_file_name      = "#{input[:image_file_name]}.tar.gz"

              tar_cmd = "cd  #{from_image_path} && "\
                        "tar cfvz  #{from_tar_file_path}/#{tar_file_name} ./* && "\
                        "cd -"


              status, output = run_command(tar_cmd)
              if status != 0
                fail _("Unable to create image tar file: Status: %{status}. Output: %{output}") % { :status => status,
                                                                                                    :output => output }
              end
              ::Fusor.log.debug "================ Created the #{input[:image_file_name]} tar file ===================="

              scp_image_file(deployment, "#{from_tar_file_path}/#{tar_file_name}", to_img_file_path)
              ::Fusor.log.debug "================ Completed Scp #{from_tar_file_path}/#{tar_file_name} to rhevm host! ===================="

              rhevm_host = deployment.rhev_engine_host.facts['ipaddress']
              ssh_user = "root"
              ssh_password = deployment.rhev_root_password

              @io = StringIO.new
              client = Utils::Fusor::SSHConnection.new(rhevm_host, ssh_user, ssh_password)
              mkdir_cmd = "mkdir -p /#{to_img_file_path}/#{input[:image_file_name]}"
              client.execute(mkdir_cmd, @io)

              # close the stringio at the end
              @io.close unless @io.closed?

              @io = StringIO.new
              untar_cmd = "tar xfvz /#{to_img_file_path}/#{tar_file_name} -C /#{to_img_file_path}/#{input[:image_file_name]}"
              client.execute(untar_cmd, @io)

              # close the stringio at the end
              @io.close unless @io.closed?

            rescue Exception => e
              @io.close if @io && !@io.closed?
              fail _("Failed to transfer the RHEL Guest 7.2 image to Virtualization Environment. Error message: #{e.message}")
            end
            ::Fusor.log.debug "================ Leaving TransferImage run method ===================="
          end

          private

          def scp_image_file(deployment, image_file, image_path)
            # scp the tar file over to the rhevm host, assume root user
            host_address = deployment.rhev_engine_host.facts['ipaddress']
            ::Fusor.log.info "Transfering tar file image to #{host_address}."
            Net::SCP.start(host_address, "root", :password => deployment.rhev_root_password, :paranoid => false) do |scp|
              scp.upload!(image_file, "/#{image_path}")
            end
          end

          def run_command(cmd)
            ::Fusor.log.info "Running: #{cmd}"
            status, output = Utils::Fusor::CommandUtils.run_command(cmd)
            ::Fusor.log.debug "Status: #{status}, output: #{output}"
            return status, output
          end
        end
      end
    end
  end
end
