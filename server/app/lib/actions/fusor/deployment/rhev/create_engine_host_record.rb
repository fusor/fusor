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

            mac_address = get_mac_address(deployment, input[:hostgroup_name])
            ::Fusor.log.debug "Found mac address override value: #{mac_address}"

            deployment.rhev_engine_host = create_host(deployment, mac_address)
            deployment.save!
            ::Fusor.log.debug '====== Leaving CreateEngineHostRecord run method ======'
          end

          private

          def get_mac_address(deployment, hostgroup_name)
            hostgroup = find_hostgroup(deployment, hostgroup_name)
            fail _("no hostgroup with name #{input[:hostgroup_name]} found") if hostgroup.nil?
            ::Fusor.log.debug "Found hostgroup with name: #{hostgroup.name}"

            # get the self-hosted puppet class from the hostgroup
            pc_self_hosted_setup = hostgroup.puppetclasses.where(:name =>  'ovirt::self_hosted::setup').first
            fail _("no puppet class 'ovirt::self_hosted::setup' found") if pc_self_hosted_setup.nil?
            ::Fusor.log.debug "Found puppetclass with name: #{pc_self_hosted_setup.name}"

            # get the lookup key
            lookup_key = pc_self_hosted_setup.class_params.where(:key => 'engine_mac_address').first
            fail _("no puppet override for 'engine_mac_address' found") if lookup_key.nil?
            ::Fusor.log.debug "Found LookupKey for key: #{lookup_key.key}"

            match_value = "hostgroup=Fusor Base/#{deployment.label}/#{hostgroup_name}"
            return LookupValue.where(:lookup_key_id => lookup_key.id).where(:match => match_value).first.value
          end

          def create_host(deployment, mac_addr)
            # TODO(fabianvf): Temporary fix while we figure out why this keeps flipping
            # Feel free to yell at fabian if this is still here when we hit GA
            redhat = Operatingsystem.find_by_title('RedHat 7.3')
            rhel_server = Operatingsystem.find_by_title('RHEL Server 7.3')
            os = redhat.nil? ? rhel_server : redhat

            rhevm = {"name" => deployment.rhev_self_hosted_engine_hostname,
                     "location_id" => Location.find_by_name('Default Location').id,
                     "environment_id" => Environment.where(:katello_id => "Default_Organization/Library/Fusor_Puppet_Content").first.id,
                     "organization_id" => deployment["organization_id"],
                     "subnet_id" => Subnet.find_by_name('default').id,
                     "enabled" => "1",
                     "managed" => "1",
                     "architecture_id" => Architecture.find_by_name('x86_64')['id'],
                     "operatingsystem_id" => os['id'],
                     "ptable_id" => Ptable.find { |p| p["name"] == "Kickstart default" }.id,
                     "domain_id" => 1,
                     "root_pass" => deployment.rhev_root_password,
                     "mac" => mac_addr,
                     "build" => "0"}
            host = ::Host.create(rhevm)

            if host.errors.empty?
              ::Fusor.log.info 'RHV Engine Host Record Created'
              return host
            else
              fail _("RHV Engine Host Record creation with mac #{mac_addr} failed with errors: #{host.errors.messages}")
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
