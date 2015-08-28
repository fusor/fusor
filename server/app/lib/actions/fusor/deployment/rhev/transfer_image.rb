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
      module Rhev
        class TransferImage < Actions::Base
          def humanized_name
            _("Transfer Image to Virtualization Environment")
          end

          def plan(deployment, repository, image_file_name = nil)
            plan_self(deployment_id: deployment.id,
                      repository_id: repository.id,
                      image_file_name: image_file_name,
                      user_id: ::User.current.id)
          end

          def run
            Rails.logger.info "================ TransferImage run method ===================="
            # Note: user_id is being passed in and then used to set User.current to address an error
            # that could occur when we later attempt to access ::Katello.pulp_server indirectly through
            # this action.  In the future, we may want to see if there are alternatives to this approach.
            ::User.current = ::User.find(input[:user_id])

            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            repository = ::Katello::Repository.find(input[:repository_id])

            image_full_path, image_file_name = find_image_details(repository, input[:image_file_name])
            scp_image_file(deployment, image_full_path)

            output[:image_full_path] = image_full_path
            output[:image_file_name] = image_file_name

            Rails.logger.info "================ Leaving TransferImage run method ===================="
          ensure
            ::User.current = nil
          end

          private

          def scp_image_file(deployment, image_file)
            # scp the cfme file over to the rhev host, assume root user
            host_address = deployment.rhev_engine_host.facts['ipaddress']
            Net::SCP.start(host_address, "root", :password => deployment.rhev_root_password, :paranoid => false) do |scp|
              scp.upload!(image_file, "/root")
            end
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

        end
      end
    end
  end
end
