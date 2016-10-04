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
        # Create a RHEV Engine Host Record
        class CreateEngineHostRecord < Actions::Fusor::FusorBaseAction
          def humanized_name
            _('Create Host Record for RHEV Engine for self-hosted')
          end

          def plan(deployment, hostgroup_name)
            super(deployment)
            plan_self(deployment_id: deployment.id, hostgroup_name: hostgroup_name)
          end

          def run
            ::Fusor.log.debug '====== CreateEngineHostRecord run method ======'
            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            ::Fusor.log.debug "Found deployment with label #{deployment.name}"
            hostgroup = find_hostgroup(deployment, input[:hostgroup_name])
            ::Fusor.log.debug "Found hostgroup with name #{deployment.name}"
            mac_address = Utils::Fusor::MacAddresses.generate_mac_address
            ::Fusor.log.debug "Generated mac address: #{mac_address}"

            deployment.rhev_engine_host = create_host(deployment, hostgroup, mac_address)
            deployment.save!
            ::Fusor.log.debug "Created host record with name #{deployment.rhev_engine_host.name}"
            ::Fusor.log.debug '====== Leaving CreateEngineHostRecord run method ======'
          end

          private

          def create_host(deployment, hostgroup, mac)
            rhevm = {"name" => deployment.rhev_self_hosted_engine_hostname,
                     "hostgroup_id" => hostgroup.id,
                     "location_id" => Location.find_by_name('Default Location').id,
                     "environment_id" => Environment.where(:name => "production").first.id,
                     "organization_id" => deployment["organization_id"],
                     "subnet_id" => Subnet.find_by_name('default').id,
                     "enabled" => "1",
                     "managed" => "1",
                     "architecture_id" => Architecture.find_by_name('x86_64')['id'],
                     "operatingsystem_id" => hostgroup.os.id,
                     "ptable_id" => Ptable.find { |p| p["name"] == "Kickstart default" }.id,
                     "domain_id" => 1,
                     "root_pass" => deployment.rhev_root_password,
                     "mac" => mac,
                     "build" => "0"}
            host = ::Host.create(rhevm)

            if host.errors.empty?
              return host
            else
              fail _("RHV Engine Host Record creation with mac #{mac} failed with errors: #{host.errors.messages}")
            end
          end

          def find_hostgroup(deployment, name)
            # locate the top-level hostgroup for the deployment...
            # currently, we'll create a hostgroup with the same name as the deployment...
            # Note: you need to scope the query to organization
            parent = ::Hostgroup.where(:name => deployment.label).
                joins(:organizations).
                where("taxonomies.id in (?)", [deployment.organization.id]).first

            # generate the ancestry, so that we can locate the hostgroups based on the hostgroup hierarchy, which assumes:
            # "Fusor Base"/"My Deployment"
            # Note: there may be a better way in foreman to locate the hostgroup
            if parent
              if parent.ancestry
                ancestry = [parent.ancestry, parent.id.to_s].join('/')
              else
                ancestry = parent.id.to_s
              end
            end

            # locate the engine hostgroup...
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
