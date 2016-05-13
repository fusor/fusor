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

module Actions
  module Fusor
    module Host
      class TriggerProvisioning < Actions::Fusor::FusorBaseAction
        def humanized_name
          _("Trigger Provisoning of Host")
        end

        def plan(deployment, hostgroup_name, host)
          super(deployment)
          plan_self(deployment_id: deployment.id, hostgroup_name: hostgroup_name, host_id: host.id)
        end

        def run
          ::Fusor.log.debug "========================= TriggerProvisioning.run ENTER ========================="
          ::Fusor.log.info "Starting host #{input[:host_id]} deployment..."
          deployment = ::Fusor::Deployment.find(input[:deployment_id])
          hostgroup = find_hostgroup(deployment, input[:hostgroup_name])
          raise "no hostgroup with name #{input[:hostgroup_name]} found" if hostgroup.nil?
          host = ::Host::Base.find(input[:host_id])

          host = assign_host_to_hostgroup(host, hostgroup)

          ::Fusor.log.debug "assign_host_to_hostgroup returned id: #{host.id} type: #{host.type}"

          ::Fusor.log.debug "========================= TriggerProvisioning.run EXIT ========================="
        end

        #
        # "borrowed" from staypuft:
        # https://github.com/theforeman/staypuft/blob/master/app/controllers/staypuft/deployments_controller.rb#L158-L216
        #
        def assign_host_to_hostgroup(assignee_host, hostgroup)
          raise "no host available to assign" if assignee_host.nil?

          converting_discovered = assignee_host.is_a? ::Host::Discovered
          if converting_discovered
            ::Fusor.log.debug "================ Validate discovered host facts ===================="

            hosts_facts = FactValue.joins(:fact_name).where(host_id: assignee_host.id)
            discovery_bootif = hosts_facts.where(fact_names: { name: 'discovery_bootif' }).first or
                raise 'unknown discovery_bootif fact'

            ::Fusor.log.debug "the discovery bootif is #{discovery_bootif.value}"

            interface = hosts_facts.
                includes(:fact_name).
                where(value: [discovery_bootif.value.upcase, discovery_bootif.value.downcase]).
                find { |v| v.fact_name.name =~ /^macaddress_.*$/ }.
                fact_name.name.split('_').last

            ::Fusor.log.debug "the interface is #{interface}"

            network = hosts_facts.where(fact_names: { name: "network_#{interface}" }).first

            ::Fusor.log.debug "the network is #{network.value}"

            if hostgroup.subnet
              hostgroup.subnet.network == network.value or
                  raise "networks do not match: #{hostgroup.subnet.network} #{network.value}"
            end

            ::Fusor.log.debug "================ Finished validating discovered host facts ===================="
          end

          ::Host.transaction do
            host = ::ForemanDiscovery::HostConverter.to_managed(assignee_host, true, true)

            # assign the hostgroup
            host.hostgroup = hostgroup

            # root_pass is not copied for some reason
            host.root_pass = hostgroup.root_pass

            #See BZ1319283 for the next 3 lines
            host.environment_id = hostgroup.parent.environment_id
            host.puppet_proxy_id = hostgroup.parent.puppet_proxy_id
            host.puppet_ca_proxy_id = hostgroup.parent.puppet_ca_proxy_id

            ::Fusor.log.debug "assignee host type is now: #{assignee_host.type}"
            ::Fusor.log.debug "saving host of type: #{host.type}"
            ::Fusor.log.debug "calling save"

            host.save

            return host
          end
        end

        private

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
