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
require 'securerandom'

module Actions
  module Fusor
    module Deployment
      module Rhev
        #Setup and Launch OSE VM
        class OseLaunch < Actions::Fusor::FusorBaseAction
          def humanized_name
            _('Setup and Launch OSE VM')
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.info '====== OSE Launch run method ======'
            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            hostgroup = find_hostgroup(deployment, 'OpenShift')

            generate_root_password(deployment)

            os = Operatingsystem.find(hostgroup.operatingsystem_id)
            ptable_name = "#{hostgroup.name} Ptable"
            ensure_vda_only_ptable(ptable_name)
            update_ptable_for_os(ptable_name, os.title)
            update_hostgroup_ptable(hostgroup, ptable_name)

            ks_name = "#{hostgroup.name} Kickstart"
            snippet_name = "rhevm_guest_agent"
            ct_util = Utils::Fusor::ConfigTemplateUtils.new({:rhevm_guest_agent_snippet_name => snippet_name})
            ret = ct_util.ensure_ks_with_snippet(ks_name, snippet_name)
            fail _("====== Could not ensure '#{ks_name}' with '#{snippet_name}'") unless ret

            ks = ProvisioningTemplate.find_by_name(ks_name)
            ks.hostgroup_ids = hostgroup.id
            ks.save!

            vm_init_params = {:deployment => deployment,
                              :application => 'ose',
                              :provider => deployment.openshift_install_loc,
                              :hostgroup => hostgroup,
                              :os => os.title,
                              :arch => 'x86_64',
                              :ptable_name => ptable_name}

            # launch master nodes
            master_vm_launch_params = {:cpu => deployment.openshift_master_vcpu,
                                       :ram => deployment.openshift_master_ram,
                                       :vda_size => deployment.openshift_master_disk,
                                       :other_disks => [deployment.openshift_storage_size]}
            for i in 1..deployment.openshift_number_master_nodes do
              vmlauncher = Utils::Fusor::VMLauncher.new(vm_init_params)
              vmlauncher.set_hostname("#{deployment.label.tr('_', '-')}-ose-master#{i}")
              host = vmlauncher.launch_openshift_vm(master_vm_launch_params)
              if host.nil?
                fail _("====== Launch OSE Master #{i} VM FAILED! ======")
              else
                deployment.ose_master_hosts << host
                ::Fusor.log.debug "====== OSE Launched VM Name : #{host.name} ======"
                ::Fusor.log.debug "====== OSE Launched VM IP   : #{host.ip}   ======"
              end
            end
            subdomain = Net::DNS::ARecord.new({:ip => host.ip,
                                               :hostname => "*.#{deployment.openshift_subdomain_name}.#{Domain.find(host.domain_id)}",
                                               :proxy => Domain.find(1).proxy})
            if subdomain.valid?
              ::Fusor.log.debug "====== OSE wildcard subdomain is not valid, it might conflict with a previous entry. Skipping. ======"
            else
              subdomain.create
              ::Fusor.log.debug "====== OSE wildcard subdomain created successfully ======"
            end

            # launch worker nodes
            worker_vm_launch_params = {:cpu => deployment.openshift_node_vcpu,
                                       :ram => deployment.openshift_node_ram,
                                       :vda_size => deployment.openshift_node_disk,
                                       :other_disks => [deployment.openshift_storage_size]}
            for i in 1..deployment.openshift_number_worker_nodes do
              vmlauncher = Utils::Fusor::VMLauncher.new(vm_init_params)
              vmlauncher.set_hostname("#{deployment.label.tr('_', '-')}-ose-node#{i}")
              host = vmlauncher.launch_openshift_vm(worker_vm_launch_params)
              if host.nil?
                fail _("====== Launch OSE Worker #{i} VM FAILED! ======")
              else
                deployment.ose_worker_hosts << host
                ::Fusor.log.debug "====== OSE Launched VM Name : #{host.name} ======"
                ::Fusor.log.debug "====== OSE Launched VM IP   : #{host.ip}   ======"
              end
            end

            deployment.save!
            ::Fusor.log.info '====== Leaving OSE Launch run method ======'
          end

          private

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

            # locate the engine hostgroup...
            ::Hostgroup.where(:name => name).
                where(:ancestry => ancestry).
                joins(:organizations).
                where("taxonomies.id in (?)", [deployment.organization.id]).first
          end

          def generate_root_password(deployment)
            ::Fusor.log.info '====== Generating randomized password for root access ======'
            deployment.openshift_root_password = SecureRandom.hex(10)
            deployment.save!
          end

          def ensure_vda_only_ptable(ptable_name)
            default_name = "Kickstart default"

            if !Ptable.exists?(:name => default_name)
              fail _("====== The expected '#{default_name}' ptable does not exist! ======")
            end

            if Ptable.exists?(:name => ptable_name)
              ::Fusor.log.debug "====== Partition table '#{ptable_name}' already exists! Nothing to do. ====== "
              return
            end

            defaultptable = Ptable.find_by_name(default_name)
            oseptable = defaultptable.clone

            layoutstring = oseptable.layout.clone
            layoutstring.sub! default_name, ptable_name
            layoutstring.sub! "autopart", "ignoredisk --only-use=vda\nautopart"

            oseptable.layout = layoutstring
            oseptable.name = ptable_name
            oseptable.save!
            ::Fusor.log.debug "====== Created a new Partition table '#{ptable_name}' ====== "
          end

          def update_ptable_for_os(ptable_name, os_name)
            ptable = Ptable.find_by_name(ptable_name)
            if ptable.nil?
              fail _("====== ptable name '#{ptable_name}' does not exist! ======")
            end

            os = Operatingsystem.find_by_to_label(os_name)
            if os.nil?
              fail _("====== OS name '#{os_name}' does not exist! ======")
            end

            if os.ptables.exists?(ptable)
              ::Fusor.log.debug "====== The '#{ptable_name}' ptable already exists as option in '#{os_name}'! Nothing to do. ====== "
              return
            end
            os.ptables << ptable
            os.save!
            ::Fusor.log.debug "====== Added '#{ptable_name}' ptable option to '#{os_name}' ====== "
          end

          def update_hostgroup_ptable(hostgroup, ptable_name)
            ptable = Ptable.find_by_name(ptable_name)
            if ptable.nil?
              fail _("====== ptable name '#{ptable_name}' does not exist! ======")
            end

            if hostgroup.nil?
              fail _("====== Hostgroup is nill ======")
            end
            hostgroup.ptable_id = ptable.id
            hostgroup.save!
            ::Fusor.log.debug "====== Updated host group '#{hostgroup}' to use '#{ptable_name}' ptable ====== "
          end
        end
      end
    end
  end
end
