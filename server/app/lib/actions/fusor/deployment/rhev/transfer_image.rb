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
        class TransferImage < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Transfer Image to Virtualization Environment")
          end

          def plan(deployment, repository, image_file_name = nil)
            super(deployment)
            plan_self(deployment_id: deployment.id,
                      repository_id: repository.id,
                      image_file_name: image_file_name,
                      user_id: ::User.current.id)
          end

          def run
            ::Fusor.log.debug "================ TransferImage run method ===================="
            # Note: user_id is being passed in and then used to set User.current to address an error
            # that could occur when we later attempt to access ::Katello.pulp_server indirectly through
            # this action.  In the future, we may want to see if there are alternatives to this approach.
            ::User.current = ::User.find(input[:user_id])

            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            repository = ::Katello::Repository.find(input[:repository_id])

            image_full_path, image_file_name = Utils::CloudForms::ImageLookup.find_image_details(repository, input[:image_file_name], 'cfme-rhev')
            scp_image_file(deployment, image_full_path)

            output[:image_full_path] = image_full_path
            output[:image_file_name] = image_file_name

            ::Fusor.log.debug "================ Leaving TransferImage run method ===================="
          ensure
            ::User.current = nil
          end

          private

          def scp_image_file(deployment, image_file)
            # scp the cfme file over to the rhev host, assume root user
            host_address = deployment.rhev_engine_host.ip
            ::Fusor.log.info "Transfering image to #{host_address}."
            Net::SCP.start(host_address, "root", :password => deployment.rhev_root_password, :paranoid => false) do |scp|
              scp.upload!(image_file, "/root")
            end
          end
        end
      end
    end
  end
end
