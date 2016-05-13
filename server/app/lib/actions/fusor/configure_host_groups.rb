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
    # TODO Cleanup class to make it shorter
    # rubocop:disable ClassLength
    class ConfigureHostGroups < Actions::Fusor::FusorBaseAction
      def humanized_name
        _("Configure Host Groups")
      end

      def plan(deployment, product_type, hostgroup_settings)
        super(deployment)
        unless hostgroup_settings && hostgroup_settings[:host_groups]
          fail _("Unable to locate host group settings in config/settings.plugins.d/fusor.yaml")
        end

        plan_self(:deployment_id => deployment.id,
                  :product_type => product_type,
                  :organization_id => deployment.organization.id,
                  :lifecycle_environment_id => deployment.lifecycle_environment_id,
                  :hostgroup_settings => hostgroup_settings,
                  :user_id => ::User.current.id)
      end

      def run
        # Note: user_id is being passed in and then used to set User.current to address an error
        # that could occur when we later attempt to access ::Katello.pulp_server indirectly through
        # this action.  In the future, we may want to see if there are alternatives to this approach.
        ::User.current = ::User.find(input[:user_id])

        deployment = ::Fusor::Deployment.find(input[:deployment_id])
        input[:hostgroup_settings][:host_groups].each do |hostgroup|
          find_or_ensure_hostgroup(deployment, input[:product_type], input[:organization_id],
                                   input[:lifecycle_environment_id], hostgroup)
        end
      ensure
        ::User.current = nil
      end

      private

      # TODO: break up this method
      # rubocop:disable MethodLength
      def find_or_ensure_hostgroup(deployment, product_type, organization_id, lifecycle_environment_id,
                                   hostgroup_settings)

        if content_view = find_content_view(organization_id, content_view_name(deployment))

          if parent_setting = hostgroup_settings[:parent]
            if parent_setting == "root_deployment"
              parent_name = deployment.label
            else
              parent_name = parent_setting
            end
            parent = ::Hostgroup.where(:name => parent_name).
                joins(:organizations).
                where("taxonomies.id in (?)", [organization_id]).first
          end

          if lifecycle_environment_id
            lifecycle_environment = ::Katello::KTEnvironment.find(lifecycle_environment_id)
            content_view_puppet_environment = content_view.puppet_env(lifecycle_environment)
          else
            lifecycle_environment = deployment.organization.library
            puppet_content_view = find_content_view(organization_id, default_puppet_content_view_name)
            content_view_puppet_environment = puppet_content_view.puppet_env(lifecycle_environment)
          end
          puppet_environment = content_view_puppet_environment.puppet_environment

          if puppet_class_settings = hostgroup_settings[:puppet_classes]
            puppet_classes = Puppetclass.where(:name => puppet_class_settings.map { |c| c[:name] }).
                joins(:environment_classes).
                where("environment_classes.environment_id in (?)", puppet_environment.id).uniq
            puppet_class_ids = puppet_classes.map(&:id)
          end

          hostgroup_params = { :parent_id => parent.try(:id),
                               :organization_ids => [organization_id] }

          if name_setting = hostgroup_settings[:name]
            # this host group is a child of the deployment group
            hostgroup_params[:name] = name_setting
            hostgroup_params[:puppetclass_ids] = puppet_class_ids
            if hostgroup_settings[:os]
              operating_system = ::Redhat.where(:name => hostgroup_settings[:os], :major => hostgroup_settings[:major], :minor => hostgroup_settings[:minor]).first
              hostgroup_params[:operatingsystem_id] = operating_system.try(:id)
              hostgroup_params[:medium_id] = operating_system.try(:media).try(:first).try(:id)
              if (hostgroup_settings[:ptable].nil?)
                hostgroup_params[:ptable_id] = operating_system.try(:ptables).try(:first).try(:id)
              else
                ptable = ::Ptable.where(:name => hostgroup_settings[:ptable])
                hostgroup_params[:ptable_id] = ptable.try(:first).try(:id)
                operating_system.try(:ptables) << ptable
                operating_system.save
              end
              hostgroup_params[:architecture_id] = operating_system.try(:architectures).try(:first).try(:id)
              hostgroup_params[:root_pass] = root_password(deployment, product_type)
            end
          else
            # this host group is the deployment group
            # add access insights class, will get inherited by all machine nodes
            if deployment.enable_access_insights
              # Puppetclass names are unique, there is only one access insights
              # puppet class regardless of how many environments or orgs there are
              insights_class = Puppetclass.find("access_insights_client")
              hostgroup_params[:puppetclass_ids] = [insights_class.id]
            end

            default_capsule_id = ::Katello::CapsuleContent.default_capsule.try(:capsule).try(:id)

            hostgroup_params[:name] = deployment.label
            hostgroup_params[:title] = deployment.label
            hostgroup_params[:lifecycle_environment_id] = lifecycle_environment.id
            hostgroup_params[:environment_id] = puppet_environment.try(:id)
            hostgroup_params[:content_view_id] = content_view.try(:id)
            hostgroup_params[:content_source_id] = default_capsule_id
            hostgroup_params[:puppet_ca_proxy_id] = default_capsule_id
            hostgroup_params[:puppet_proxy_id] = default_capsule_id
          end
        else
          fail _("Unable to locate content view '%s'.") % content_view_name(deployment)
        end

        if hostgroup = find_hostgroup(organization_id, hostgroup_params[:name], parent)
          hostgroup.update_attributes!(hostgroup_params)
          parameter = ::GroupParameter.where(:type => "GroupParameter",
                                             :reference_id => hostgroup.id,
                                             :name => "kt_activation_keys").first
          if activation_key_name = activation_key_name(deployment, hostgroup_settings)
            parameter.update_attributes!(:reference_id => hostgroup.id,
                                         :name => "kt_activation_keys",
                                         :value => activation_key_name)
          end
        else
          # Note: when setting the arch, medium and ptable, we assume that there will only be 1
          # associated with the operating system.  If we need to support multiple in the future,
          # we'll need to update this behavior.
          hostgroup = ::Hostgroup.new(hostgroup_params)
          hostgroup.save!

          if activation_key_name = activation_key_name(deployment, hostgroup_settings)
            ::GroupParameter.create!(:reference_id => hostgroup.id,
                                     :name => "kt_activation_keys",
                                     :value => activation_key_name)
          end
        end
        apply_setting_parameter_overrides(hostgroup, hostgroup_settings, puppet_environment)
        apply_deployment_parameter_overrides(hostgroup, deployment, product_type, puppet_environment)
      end

      def apply_setting_parameter_overrides(hostgroup, hostgroup_settings, puppet_environment)
        # Go through the hostgroup_settings.  If any of the puppet classes have a
        # parameter override specified, set it for the host group.
        if puppet_class_settings = hostgroup_settings[:puppet_classes]
          puppet_class_settings.each do |puppet_class_setting|

            if parameter_settings = puppet_class_setting[:parameters]
              parameter_settings.each do |parameter_setting|
                unless parameter_setting[:override].blank?
                  puppet_class = Puppetclass.where(:name => puppet_class_setting[:name]).
                      joins(:environment_classes).
                      where("environment_classes.environment_id in (?)", puppet_environment.id).first

                  hostgroup.set_param_value_if_changed(puppet_class, parameter_setting[:name],
                                                       parameter_setting[:override])
                end
              end
            end
          end
        end
      end

      def apply_deployment_parameter_overrides(hostgroup, deployment, product_type, puppet_environment)
        # TODO: ISSUE: the following attributes exist on the deployment object, but I do not know
        # if they should be mapping to puppet class parameters and if so, which class & parameter?
        # :name => , :value => deployment.rhev_data_center_name,
        # :name => , :value => deployment.cfme_install_loc,
        # :name => , :value => deployment.rhev_is_self_hosted,

        # TODO: ISSUE: the following attribute exists on both ovirt::engine::config & ovirt::engine::setup; however,
        # unclear which one the deployment attribute is associated with
        # :name => , :value => deployment.rhev_storage_type,
        deployment_overrides = get_deployment_overrides(deployment, hostgroup, product_type)

        # Check if the host group has some overrides specified for this deployment.
        # If it does, set them for the host group.
        if overrides = deployment_overrides.find { |hg| hg[:hostgroup_name] == hostgroup.name }
          overrides[:puppet_classes].each do |pclass|
            puppet_class = Puppetclass.where(:name => pclass[:name]).
                joins(:environment_classes).
                where("environment_classes.environment_id in (?)", puppet_environment.id).first

            pclass[:parameters].each do |parameter|
              hostgroup.set_param_value_if_changed(puppet_class, parameter[:name], parameter[:value])
            end
          end
        end
      end

      def get_deployment_overrides(deployment, hostgroup, product_type)
        return [
          get_rhev_engine_deployment_overrides(deployment, hostgroup, product_type),
          get_rhev_self_hosted_deployment_overrides(deployment, hostgroup, product_type)
        ]
      end

      def get_rhev_engine_deployment_overrides(deployment, hostgroup, product_type)
        return {
          :hostgroup_name => "RHEV-Engine",
          :puppet_classes =>
          [
            {
              :name => "ovirt",
              :parameters =>
              [
                { :name => "deploy_cfme", :value => deployment.deploy_cfme }
              ]
            },
            {
              :name => "ovirt::engine::config",
              :parameters =>
              [
                { :name => "hosts_addresses", :value => host_addresses(deployment, hostgroup) },
                # Setting root password based upon the deployment vs the hostgroup.  This is
                # necessary because the puppet parameter needs to store it in clear text and
                # the hostgroup stores it using one-time encryption.
                { :name => "root_password", :value => root_password(deployment, product_type) },
                { :name => "dc_name", :value => deployment.rhev_data_center_name },
                { :name => "cluster_name", :value => deployment.rhev_cluster_name },
                { :name => "storage_name", :value => deployment.rhev_storage_name },
                { :name => "storage_address", :value => deployment.rhev_storage_address },
                { :name => "storage_type", :value => deployment.rhev_storage_type },
                { :name => "storage_path", :value => deployment.rhev_share_path },
                { :name => "cpu_type", :value => deployment.rhev_cpu_type },
                { :name => "export_name", :value => deployment.rhev_export_domain_name },
                { :name => "export_address", :value => deployment.rhev_export_domain_address },
                { :name => "export_path", :value => deployment.rhev_export_domain_path }
              ]
            },
            {
              :name => "ovirt::engine::setup",
              :parameters =>
              [
                { :name => "storage_type", :value => deployment.rhev_storage_type },
                { :name => "admin_password", :value => deployment.rhev_engine_admin_password }
              ]
            }
          ]
        }
      end

      def get_rhev_self_hosted_deployment_overrides(deployment, hostgroup, product_type)
        return {
          :hostgroup_name => "RHEV-Self-hosted",
          :puppet_classes =>
          [
            {
              :name => "ovirt",
              :parameters =>
              [
                { :name => "deploy_cfme", :value => deployment.deploy_cfme }
              ]
            },
            {
              :name => "ovirt::self_hosted::config",
              :parameters =>
              [
                { :name => "hosts_addresses", :value => host_addresses(deployment, hostgroup) }
              ]
            },
            {
              :name => "ovirt::self_hosted::setup",
              :parameters =>
              [
                # Setting root password based upon the deployment vs the hostgroup.  This is
                # necessary because the puppet parameter needs to store it in clear text and
                # the hostgroup stores it using one-time encryption.
                { :name => "root_password", :value => root_password(deployment, product_type) },
                { :name => "dc_name", :value => deployment.rhev_data_center_name },
                { :name => "satellite_fqdn", :value => ::SmartProxy.first.hostname },
                { :name => "gateway", :value => ::Subnet.find_by_name('default').gateway },
                { :name => "cluster_name", :value => deployment.rhev_cluster_name },
                { :name => "cpu_type", :value => deployment.rhev_cpu_type },
                { :name => "cpu_model", :value => get_cpu_model(deployment.rhev_cpu_type) },
                { :name => "storage_name", :value => deployment.rhev_storage_name },
                { :name => "storage_address", :value => deployment.rhev_storage_address },
                { :name => "storage_type", :value => deployment.rhev_storage_type },
                { :name => "storage_path", :value => deployment.rhev_share_path },
                { :name => "engine_mac_address", :value => Utils::Fusor::MacAddresses.generate_mac_address },
                { :name => "engine_fqdn", :value => "#{deployment.label.tr('_', '-')}-rhev-engine.#{hostgroup.domain.name}" },
                { :name => "engine_admin_password", :value => deployment.rhev_engine_admin_password },
                { :name => "engine_activation_key", :value => hostgroup.params['kt_activation_keys'] },
                { :name => "export_name", :value => deployment.rhev_export_domain_name },
                { :name => "export_address", :value => deployment.rhev_export_domain_address },
                { :name => "export_path", :value => deployment.rhev_export_domain_path },
                { :name => "hosted_storage_name", :value => deployment.hosted_storage_name },
                { :name => "hosted_storage_address", :value => deployment.hosted_storage_address },
                { :name => "hosted_storage_path", :value => deployment.hosted_storage_path }
              ]
            }
          ]
        }
      end

      def root_password(deployment, product_type)
        case product_type
          when "rhev"
            deployment.rhev_root_password
          when "cfme"
            deployment.cfme_root_password
        end
      end

      def host_addresses(deployment, hostgroup)
        addresses = deployment.discovered_hosts.inject([]) do |result, host|
          if host.name && hostgroup.domain
            result << [host.name, hostgroup.domain.name].join('.')
          end
        end
        addresses.join(',')
      end

      def find_hostgroup(organization_id, hostgroup_name, parent)
        if parent
          if parent.ancestry
            ancestry = [parent.ancestry, parent.id.to_s].join('/')
          else
            ancestry = parent.id.to_s
          end
        end

        ::Hostgroup.where(:name => hostgroup_name).
                    where(:ancestry => ancestry).
                    joins(:organizations).
                    where("taxonomies.id in (?)", [organization_id]).first
      end

      def find_content_view(organization_id, view_name)
        ::Katello::ContentView.where(:organization_id => organization_id, :name => view_name).first
      end

      def content_view_name(deployment)
        if deployment.lifecycle_environment_id
          name = SETTINGS[:fusor][:content][:content_view][:composite_view_name]
          [name, deployment.label].join(' - ') if name
        else
          deployment.organization.default_content_view.name
        end
      end

      def default_puppet_content_view_name
        SETTINGS[:fusor][:content][:content_view][:puppet_component_view_name]
      end

      def activation_key_name(deployment, hostgroup)
        return unless hostgroup[:activation_key] && hostgroup[:activation_key][:name]

        name = hostgroup[:activation_key][:name]
        hg_name = hostgroup[:name]
        return [name, deployment.label, hg_name].map { |str| str.tr('-', "_") }.join('-')
      end

      def get_cpu_model(cpu_type)
        self_hosted_cpu_map = {
          'Intel Broadwell Family' => 'model_Broadwell',
          'Intel Conroe Family' => 'model_Conroe',
          'Intel Penryn Family' => 'model_Penryn',
          'Intel Nehalem Family' => 'model_Nehalem',
          'Intel Westmere Family' => 'model_Westmere',
          'Intel SandyBridge Family' => 'model_SandyBridge',
          'Intel Haswell' => 'model_Haswell',
          'AMD Opteron G1' => 'model_Opteron_G1',
          'AMD Opteron G2' => 'model_Opteron_G2',
          'AMD Opteron G3' => 'model_Opteron_G3',
          'AMD Opteron G4' => 'model_Opteron_G4',
          'AMD Opteron G5' => 'model_Opteron_G5',
          # 'IBM POWER 8' => 'UNSUPPORTED',
        }
        return self_hosted_cpu_map[cpu_type]
      end
    end
  end
end
