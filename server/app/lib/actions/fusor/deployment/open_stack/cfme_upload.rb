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

require 'fog'

module Actions
  module Fusor
    module Deployment
      module OpenStack
        #Upload CFME to the overcloud
        class CfmeUpload < Actions::Fusor::FusorBaseAction
          def humanized_name
            _('Upload CFME to the overcloud')
          end

          def plan(deployment, repository, image_file_name = nil)
            super(deployment)
            plan_self(deployment_id: deployment.id,
                      repository_id: repository.id,
                      image_file_name: image_file_name,
                      user_id: ::User.current.id)
          end

          def run
            ::Fusor.log.debug '====== CFME Upload run method ======'
            ::User.current = ::User.find(input[:user_id])

            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            repository = ::Katello::Repository.find(input[:repository_id])
            image_full_path, _image_file_name = Utils::CloudForms::ImageLookup.find_image_details(repository, input[:image_file_name], 'cfme-rhos')

            overcloud = { :openstack_auth_url  => "https://#{deployment.openstack_deployment.overcloud_hostname}:13000/v2.0/tokens",
                          :openstack_username  => 'admin', :openstack_tenant => 'admin',
                          :openstack_api_key   => deployment.openstack_deployment.overcloud_password }
            upload_cfme_image(overcloud, "#{deployment.label}-cfme", image_full_path)
            ::Fusor.log.debug '====== Leaving CFME Upload run method ======'
          ensure
            ::User.current = nil
          end

          private

          def upload_cfme_image(overcloud, name, cfme_image)
            glance = Fog::Image::OpenStack::V2.new(overcloud)
            # This has at times proven unreliable

            tries = 25
            begin
              image_handle = glance.images.create :name => name, :disk_format => 'qcow2', :container_format => 'bare', :is_public => 'true'
              image_handle.upload_data File.binread(cfme_image)
            rescue
              tries -= 1
              if tries > 0
                retry
              end
            end
          end
        end
      end
    end
  end
end
