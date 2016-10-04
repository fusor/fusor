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
      module Rhev
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
            compute_attrs = create_compute_profile(deployment).vm_attrs
            host = create_host(deployment, compute_attrs)
            deployment.cfme_rhv_address = host.ip
            deployment.cfme_rhv_hostname = host.name
            deployment.save!
            ::Fusor.log.debug '====== Leaving CFME Launch run method ======'
          end

          def cfme_launch_completed
            ::Fusor.log.info 'CFME Launch Completed'
          end

          def cfme_launch_failed(errors)
            ::Fusor.log.info errors.full_messages.to_s
            fail _("CFME Launch failed with error #{errors.full_messages}")
          end

          private

          def create_compute_profile(deployment)
            cp = ComputeProfile.create("name" => "#{deployment.label}-rhv-cfme")
            cr = ComputeResource.find_by_name("#{deployment.label}-RHEV")
            cl_id = cr.clusters.find { |c| c.name == deployment.rhev_cluster_name }.id
            net_id = cr.available_networks(cl_id).first.id
            storage_id = cr.available_storage_domains(cl_id).first.id
            template_id = cr.templates.find { |t| t.name == "#{deployment.label}-cfme-template" }.id

            ComputeAttribute.create({"compute_profile_id" => cp.id,
                                     "compute_resource_id" => cr.id,
                                     "vm_attrs" => {
                                       "cluster" => cl_id,
                                       "template" => template_id,
                                       "cores" => 4,
                                       "memory" => 8_589_934_592,
                                       "interfaces_attributes" => {
                                         "new_interfaces" => {
                                           "name" => "",
                                           "network" => net_id,
                                           "delete" => ""
                                         }.with_indifferent_access,
                                         "0" => {
                                           "name" => "eth0",
                                           "network" => net_id,
                                           "delete" => ""
                                         }.with_indifferent_access
                                       }.with_indifferent_access,
                                       "volumes_attributes" => {
                                         "new_volumes" => {
                                           "size_gb" => "",
                                           "storage_domain" => storage_id,
                                           "_delete" => "",
                                           "id" => "",
                                           "preallocate" => "0"
                                         }.with_indifferent_access,
                                         "0" => {
                                           "size_gb" => 40,
                                           "storage_domain" => storage_id,
                                           "_delete" => "",
                                           "id" => "",
                                           "preallocate" => "0"
                                         }.with_indifferent_access
                                       }.with_indifferent_access
                                     }.with_indifferent_access
                                   }.with_indifferent_access)
          end

          def create_host(deployment, compute_attrs)
            cr = ComputeResource.find_by_name("#{deployment.label}-RHEV")
            cl_id = cr.clusters.find { |c| c.name == deployment.rhev_cluster_name }.id
            net_id = cr.available_networks(cl_id).first.id

            cfme = {"name" => "#{deployment.label.tr('_', '-')}-rhv-cfme",
                    "location_id" => Location.find_by_name('Default Location').id,
                    "environment_id" => Environment.where(:name => "production").first.id,
                    "organization_id" => deployment["organization_id"],
                    "compute_resource_id" => ComputeResource.find_by_name("#{deployment.label}-RHEV").id,
                    "enabled" => "1",
                    "managed" => "1",
                    "architecture_id" => Architecture.find_by_name('x86_64')['id'],
                    "hostgroup_id" => find_hostgroup(deployment, "Cloudforms")["id"],
                    "ptable_id" => Ptable.find { |p| p["name"] == "Kickstart default" }.id,
                    "root_pass" => "smartvm1",
                    "build" => "0",
                    #using a compute_profile_id the vm does not start, so for now merge with attr.
                    "compute_attributes" => {"start" => "1"}.with_indifferent_access.merge(compute_attrs),
                    "interfaces_attributes" => {
                      "0" => {
                        "_destroy" => "0",
                        "type" => "Nic::Managed",
                        "mac" => "",
                        "identifier" => "",
                        "name" => "eth0",
                        "domain_id" => "1",
                        "subnet_id" => "1",
                        "managed" => "1",
                        "primary" => "1",
                        "provision" => "1",
                        "virtual" => "0",
                        "tag" => "",
                        "attached_to" => "",
                        "compute_attributes" => {
                          "name" => "eth0",
                          "network" => net_id
                        }
                      },
                      "new_interfaces" => {
                        "_destroy" => "1",
                        "type" => "Nic::Managed",
                        "mac" => "",
                        "identifier" => "",
                        "name" => "eth0",
                        "domain_id" => "",
                        "subnet_id" => "",
                        "ip" => "",
                        "managed" => "1",
                        "primary" => "0",
                        "provision" => "0",
                        "virtual" => "0",
                        "tag" => "",
                        "attached_to" => "",
                        "compute_attributes" => {
                          "name" => "eth0",
                          "network" => net_id
                        }
                      }
                    }
            }
            host = ::Host.create(cfme)

            if host.errors.empty?
              cfme_launch_completed
              return host
            else
              cfme_launch_failed host.errors
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
