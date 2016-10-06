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
            deployment.cfme_osp_address = host.ip
            deployment.cfme_osp_hostname = host.name
            deployment.save!
            ::Fusor.log.debug '====== Leaving CFME Launch run method ======'
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
            hostgroup = find_hostgroup(deployment, "Cloudforms")
            Image.create("name" => "#{deployment.label}-osp-cfme",
              "username" => 'root',
              "user_data" => 1,
              "uuid" => cr.available_images.find { |hash| "#{deployment.label}-cfme" == hash.name }.id,
              "compute_resource_id" => cr.id,
              "operatingsystem_id" => hostgroup["operatingsystem_id"],
              "architecture_id" => Architecture.find_by_name('x86_64')['id'])
          end

          def create_compute_profile(deployment)
            cp = ComputeProfile.create("name" => "#{deployment.label}-osp-cfme")
            overcloud = { :openstack_auth_url  => "https://#{deployment.openstack_deployment.overcloud_hostname}:13000/v2.0/tokens",
                          :openstack_username  => 'admin', :openstack_tenant => 'admin',
                          :openstack_api_key   => deployment.openstack_deployment.overcloud_password }
            keystone = Fog::Identity::OpenStack.new(overcloud)
            tenant = keystone.get_tenants_by_name(deployment.label).body["tenant"]
            neutron = Fog::Network::OpenStack.new(overcloud)
            nic = neutron.list_networks.body["networks"].find { |hash| "#{deployment.label}-net" == hash["name"] }['id']

            ComputeAttribute.create({"compute_profile_id" => cp.id,
                                     "compute_resource_id" => ComputeResource.find_by_name("#{deployment.label}-RHOS")['id'],
                                     "vm_attrs" => {
                                       "flavor_ref" => "4",
                                       "network" => "#{deployment.label}-float-net",
                                       "image_ref" => Image.find_by_name("#{deployment.label}-osp-cfme").uuid,
                                       "security_groups" => "#{deployment.label}-sec-group",
                                       "nics" => ["", nic],
                                       "tenant_id" => tenant['id']
                                     }.with_indifferent_access
                                    }.with_indifferent_access)
          end

          def create_host(deployment)
            cfme = {"name" => "#{deployment.label.tr('_', '-')}-osp-cfme",
                    "location_id" => Location.find_by_name('Default Location').id,
                    "environment_id" => Environment.where(:name => "production").first.id,
                    "organization_id" => deployment["organization_id"],
                    "compute_resource_id" => ComputeResource.find_by_name("#{deployment.label}-RHOS").id,
                    "enabled" => 1,
                    "managed" => 1,
                    "architecture_id" => Architecture.find_by_name('x86_64')['id'],
                    "hostgroup_id" => find_hostgroup(deployment, "Cloudforms")["id"],
                    "domain_id" => 1,
                    "root_pass" => "smartvm",
                    "provision_method" => "image",
                    "build" => 1,
                    "is_owned_by" => "3-Users",
                    "compute_profile_id" => ComputeProfile.find_by_name("#{deployment.label}-osp-cfme").id}
            host = ::Host.create(cfme)

            if host.global_status == 0
              cfme_launch_completed
              return host
            else
              cfme_launch_failed
            end
          end

          def find_hostgroup(deployment, name)
            # locate the top-level hostgroup for the deployment...
            # currently, we'll create a hostgroup with the same name as the
            # deployment...
            # Note: you need to scope the query to organization
            parent = ::Hostgroup.where(:name => deployment.label).
                joins(:organizations).
                where("taxonomies.id in (?)", [deployment.organization.id]).first

            # generate the ancestry, so that we can locate the hostgroups
            # based on the hostgroup hierarchy, which assumes:
            #  "Fusor Base"/"My Deployment"
            # Note: there may be a better way in foreman to locate the hostgroup
            if parent
              if parent.ancestry
                ancestry = [parent.ancestry, parent.id.to_s].join('/')
              else
                ancestry = parent.id.to_s
              end
            end

            ::Hostgroup.where(:name => name).
                where(:ancestry => ancestry).
                joins(:organizations).
                where("taxonomies.id in (?)", [deployment.organization.id]).first
          end
        end
      end
    end
  end
end
