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
        #Setup and Launch CFME VM
        class CfmeLaunch < Actions::Fusor::FusorBaseAction
          def humanized_name
            _('Setup and Launch CFME VM')
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.debug '====== CFME Launch run method ======'
            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            create_image(deployment)
            create_compute_profile(deployment)
            host = create_host(deployment)
            deployment.cfme_address = host.ip
            deployment.cfme_hostname = host.name
            deployment.save!
            ::Fusor.log.debug '====== Leaving Launc Upload run method ======'
          end

          def cfme_launch_completed
            ::Fusor.log.info 'CFME Launch Completed'
          end

          def cfme_launch_failed
            fail _('CFME Launch failed')
          end

          private

          def create_image(deployment)
            cr = ComputeResource.find_by_name("#{deployment.label}-RHOS")
            Image.create("name" => "#{deployment.label}-cfme",
              "username" => 'root',
              "user_data" => 1,
              "uuid" => cr.available_images.find { |hash| "#{deployment.label}-cfme" == hash.name }.id,
              "compute_resource_id" => cr.id,
              "operatingsystem_id" => Operatingsystem.find_by_title('RedHat 7.1')['id'],
              "architecture_id" => Architecture.find_by_name('x86_64')['id'])
          end

          def create_compute_profile(deployment)
            cp = ComputeProfile.create("name" => "#{deployment.label}-cfme")
            overcloud = { :openstack_auth_url  => "http://#{deployment.openstack_overcloud_address}:5000/v2.0/tokens",
                          :openstack_username  => 'admin', :openstack_tenant => 'admin',
                          :openstack_api_key   => deployment.openstack_overcloud_password }
            keystone = Fog::Identity::OpenStack.new(overcloud)
            tenant = keystone.get_tenants_by_name(deployment.label).body["tenant"]
            neutron = Fog::Network::OpenStack.new(overcloud)
            nic = neutron.list_networks.body["networks"].find { |hash| "#{deployment.label}-net" == hash["name"] }['id']

            ComputeAttribute.create({"compute_profile_id" => cp.id,
                                     "compute_resource_id" => ComputeResource.find_by_name("#{deployment.label}-RHOS")['id'],
                                     "vm_attrs" => {
                                       "flavor_ref" => "4",
                                       "network" => "#{deployment.label}-float-net",
                                       "image_ref" => Image.find_by_name("#{deployment.label}-cfme").uuid,
                                       "security_groups" => "#{deployment.label}-sec-group",
                                       "nics" => ["", nic],
                                       "tenant_id" => tenant['id']
                                     }.with_indifferent_access
                                    }.with_indifferent_access)
          end

          def create_host(deployment)
            cfme = {"name" => "#{deployment.label.tr('_', '-')}-cfme",
                    "location_id" => Location.find_by_name('Default Location').id,
                    "environment_id" => Environment.where(:katello_id => "Default_Organization/Library/Fusor_Puppet_Content").first.id,
                    "organization_id" => deployment["organization_id"],
                    "compute_resource_id" => ComputeResource.find_by_name("#{deployment.label}-RHOS").id,
                    "enabled" => 1,
                    "managed" => 1,
                    "architecture_id" => Architecture.find_by_name('x86_64')['id'],
                    "operatingsystem_id" => Operatingsystem.find_by_title('RedHat 7.1')['id'],
                    "domain_id" => 1,
                    "root_pass" => "smartvm",
                    "mac" => "admin",
                    "provision_method" => "image",
                    "build" => 1,
                    "is_owned_by" => "3-Users",
                    "compute_profile_id" => ComputeProfile.find_by_name("#{deployment.label}-cfme").id}
            ::Host.create(cfme)
          end
        end
      end
    end
  end
end
