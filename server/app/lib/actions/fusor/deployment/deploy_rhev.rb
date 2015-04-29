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
    module Deployment
      class DeployRhev < Actions::Base
        def humanized_name
          _("Deploy Red Hat Enterprise Virtualization")
        end

        def plan(deployment)
          Rails.logger.warn "XXX ================ Planning RHEV Deployment ===================="

          # VERIFY PARAMS HERE
          if deployment.deploy_rhev
            fail _("Unable to locate a RHEV Engine Host") unless deployment.rhev_engine_host
          end

          plan_self deployment_id: deployment.id
        end

        def finalize
          Rails.logger.warn "XXX ================ Deploy RHEV finalize method ===================="

          deployment_id = input.fetch(:deployment_id)

          deployment = ::Fusor::Deployment.find(deployment_id)

          if deployment.rhev_engine_host.nil?
            Rails.logger.warn "XXX finalize: WE DO NOT HAVE A RHEV ENGINE HOST."
          else
            Rails.logger.warn "XXX finalize: managed host? #{deployment.rhev_engine_host.managed?}"
          end
          Rails.logger.warn "XXX finalize: deployment name is: #{deployment.name}"
          Rails.logger.warn "XXX finalize: deployment org is: #{deployment.organization.id}"

          Rails.logger.warn "XXX ================ RHEV Hypervisor piece ===================="

          # let's find the proper hostgroup and associate it with the
          # hypervisors
          hypervisor_group = find_hypervisor_hostgroup(deployment)

          Rails.logger.warn "XXX finalize: calling assign_host_to_hostgroup (hypervisor)"

          deployment.discovered_hosts.each do |da_host|
            success, da_host = assign_host_to_hostgroup(da_host, hypervisor_group)

            Rails.logger.warn "XXX finalize: returned from assign_host_to_hostgroup. #{success}"
            if da_host
              Rails.logger.warn "XXX finalize: hypervisor host is NOT null! YAY!"
              reboot_host(da_host)
            else
              Rails.logger.warn "XXX finalize: damn what happened to the hypervisor host"
            end
          end

          Rails.logger.warn "XXX ================ RHEV Engine piece ===================="

          # let's find the proper hostgroup and associate it with the engine
          engine_group = find_engine_hostgroup(deployment)

          Rails.logger.warn "XXX finalize: calling assign_host_to_hostgroup (engine)"

          success, host = assign_host_to_hostgroup(deployment.rhev_engine_host, engine_group)

          Rails.logger.warn "XXX returned from assign_host_to_hostgroup. #{success}"
          if host
            Rails.logger.warn "XXX engine host is NOT null! YAY!"
            reboot_host(host)
          else
            Rails.logger.warn "XXX damn what happened to the engine host"
          end

          Rails.logger.warn "XXX ================ Leaving finalize method ===================="
        end

        def find_engine_hostgroup(deployment)
          find_hostgroup(deployment, "RHEV-Engine")
        end

        def find_hypervisor_hostgroup(deployment)
          find_hostgroup(deployment, "RHEV-Hypervisor")
        end

        #
        # "borrowed" from staypuft:
        # https://github.com/theforeman/staypuft/blob/master/app/controllers/staypuft/deployments_controller.rb#L158-L216
        #
        def assign_host_to_hostgroup(assignee_host, hostgroup)
          raise "no host available to assign" if assignee_host.nil?

          converting_discovered = assignee_host.is_a? Host::Discovered

          if converting_discovered
            Rails.logger.warn "XXX ================ Converting a discovered host ===================="

            hosts_facts = FactValue.joins(:fact_name).where(host_id: assignee_host.id)
            discovery_bootif = hosts_facts.where(fact_names: { name: 'discovery_bootif' }).first or
                raise 'unknown discovery_bootif fact'

            Rails.logger.warn "XXX the discovery bootif is #{discovery_bootif.value}"

            interface = hosts_facts.
                includes(:fact_name).
                where(value: [discovery_bootif.value.upcase, discovery_bootif.value.downcase]).
                find { |v| v.fact_name.name =~ /^macaddress_.*$/ }.
                fact_name.name.split('_').last

            Rails.logger.warn "XXX the interface is #{interface}"

            network = hosts_facts.where(fact_names: { name: "network_#{interface}" }).first

            Rails.logger.warn "XXX the network is #{network.value}"

            if hostgroup.subnet
              hostgroup.subnet.network == network.value or
                  raise "networks do not match: #{hostgroup.subnet.network} #{network.value}"
            else
              Rails.logger.warn "XXX subnet is NIL! why?"
            end

            ip = hosts_facts.where(fact_names: { name: "ipaddress_#{interface}" }).first

            Rails.logger.warn "XXX ip address is #{ip.value}"
            Rails.logger.warn "XXX ================ Finished converting discovered host ===================="
          end

          original_type = assignee_host.type
          host          = if converting_discovered
                            assignee_host.becomes(::Host::Managed).tap do |host|
                              host.type    = 'Host::Managed'
                              host.managed = true
                              host.ip      = ip.value
                              host.mac     = discovery_bootif.value
                            end
                          else
                            assignee_host
                          end

          host.hostgroup = hostgroup
          # set build to true so the PXE config-template takes effect under discovery environment
          host.build = true if assignee_host.managed?

          # root_pass is not copied for some reason
          host.root_pass = hostgroup.root_pass

          # clear all virtual devices that may have been created during previous assignment
          # host.clean_vlan....
          host.interfaces.virtual.map(&:destroy)
          # by default foreman will try to manage all NICs unless user disables manually after assignment
          #host.make_all_interfaces_managed
          host.interfaces.each do |interface|
            interface.managed = true
            interface.save!
          end

          # I do not [know] why but the final save! adds following condytion to the update SQL command
          # "WHERE "hosts"."type" IN ('Host::Managed') AND "hosts"."id" = 283"
          # which will not find the record since it's still Host::Discovered.
          # Using #update_column to change it directly in DB
          # (assignee_host is used to avoid same WHERE condition problem here).
          # FIXME this is definitely ugly, needs to be properly fixed
          assignee_host.update_column :type, 'Host::Managed'

          Rails.logger.warn "XXX assignee host type is now: #{assignee_host.type}"

          # TODO: calling save to explicitly see errors in log
          host.save!

          [host.save, host].tap do |saved, _|
            assignee_host.becomes(Host::Base).update_column(:type, original_type) unless saved
            Rails.logger.warn "XXX we finished becoming a Host::Base"
            assignee_host
          end
        end

        private

        def reboot_host(host)
          Rails.logger.warn "XXX About to reboot host"
          host.becomes(::Host::Discovered).reboot unless host.nil?
          Rails.logger.warn "XXX host rebooted"
        end

        def find_hostgroup(deployment, name)
          # locate the top-level hostgroup for the deployment...
          # currently, we'll create a hostgroup with the same name as the deployment...
          # Note: you need to scope the query to organization
          parent = ::Hostgroup.where(:name => deployment.name).
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
          host_group = ::Hostgroup.where(:name => name).
                                   where(:ancestry => ancestry).
                                   joins(:organizations).
                                   where("taxonomies.id in (?)", [deployment.organization.id]).first
        end
      end
    end
  end
end
