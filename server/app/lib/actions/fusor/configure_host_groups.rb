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
    class ConfigureHostGroups < Actions::Base
      def humanized_name
        _("Configure Host Groups")
      end

      def plan(deployment, hostgroup_settings)
        unless hostgroup_settings && hostgroup_settings[:host_groups]
          fail _("Unable to locate host group settings in config/settings.plugins.d/fusor.yaml")
        end

        plan_self(:deployment_name => deployment.name,
                  :organization_id => deployment.organization.id,
                  :lifecycle_environment_id => deployment.lifecycle_environment.id,
                  :hostgroup_settings => hostgroup_settings,
                  :user_id => ::User.current.id)
      end

      def finalize
        # Note: user_id is being passed in and then used to set User.current to address an error
        # that could occur when we later attempt to access ::Katello.pulp_server indirectly through
        # this action.  In the future, we may want to see if there are alternatives to this approach.
        ::User.current = ::User.find(input[:user_id])

        input[:hostgroup_settings][:host_groups].each do |hostgroup|
          find_or_ensure_hostgroup(input[:deployment_name], input[:organization_id],
                                   input[:lifecycle_environment_id], hostgroup)
        end
      ensure
        ::User.current = nil
      end

      private

      def find_or_ensure_hostgroup(deployment_name, organization_id, lifecycle_environment_id, hostgroup_settings)
        if content_view = find_content_view(organization_id, content_view_name(deployment_name))

          if parent_setting = hostgroup_settings[:parent]
            if parent_setting == "root_deployment"
              parent_name = deployment_name
            else
              parent_name = parent_setting
            end
            parent = ::Hostgroup.where(:name => parent_name).
                joins(:organizations).
                where("taxonomies.id in (?)", [organization_id]).first
          end

          lifecycle_environment = ::Katello::KTEnvironment.find(lifecycle_environment_id)
          content_view_puppet_environment = content_view.puppet_env(lifecycle_environment)

          if puppet_class_settings = hostgroup_settings[:puppet_classes]
            puppet_classes = Puppetclass.where(:name => puppet_class_settings.map{ |c| c[:name] }).
                joins(:environment_classes).
                where("environment_classes.environment_id in (?)",
                      content_view_puppet_environment.puppet_environment.id).uniq
            puppet_class_ids = puppet_classes.map(&:id)
          end

          if name_setting = hostgroup_settings[:name]
            # this host group is a child of the deployment group; therefore, some attributes
            # do not need to be set
            hostgroup_name = name_setting
            lifecycle_environment_id = nil
            content_view_puppet_environment = nil
            content_view = nil
            default_capsule_id = nil
            operating_system = nil
          else
            # this host group is the deployment group
            hostgroup_name = deployment_name
            operating_system = find_operating_system(lifecycle_environment, content_view)
            default_capsule_id = ::Katello::CapsuleContent.default_capsule.try(:capsule).try(:id)
          end
        else
          fail _("Unable to locate content view '%s'.") % content_view_name(deployment_name)
        end

        hostgroup_params = { :parent_id => parent.id,
                             :name => hostgroup_name,
                             :organization_ids => [organization_id],
                             :lifecycle_environment_id => lifecycle_environment_id,
                             :environment_id => content_view_puppet_environment.try(:puppet_environment).try(:id),
                             :content_view_id => content_view.try(:id),
                             :content_source_id => default_capsule_id,
                             :puppet_ca_proxy_id => default_capsule_id,
                             :puppet_proxy_id => default_capsule_id,
                             :puppetclass_ids => puppet_class_ids,
                             :operatingsystem_id => operating_system.try(:id),
                             :medium_id => operating_system.try(:media).try(:first).try(:id),
                             :ptable_id => operating_system.try(:ptables).try(:first).try(:id) }

        if hostgroup = find_hostgroup(organization_id, hostgroup_name, parent)
          hostgroup.update_attributes!(hostgroup_params)

          parameter = ::GroupParameter.where(:type => "GroupParameter",
                                             :reference_id => hostgroup.id,
                                             :name => "kt_activation_keys").first
          parameter.update_attributes!(:reference_id => hostgroup.id,
                                       :name => "kt_activation_keys",
                                       :value => activation_key_name(deployment_name))
        else
          # Note: when setting the arch, medium and ptable, we assume that there will only be 1
          # associated with the operating system.  If we need to support multiple in the future,
          # we'll need to update this behavior.
          hostgroup = ::Hostgroup.create!(hostgroup_params)

          ::GroupParameter.create!(:hostgroup => hostgroup,
                                   :name => "kt_activation_keys",
                                   :value => activation_key_name(deployment_name))
        end
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

      def find_operating_system(lifecycle_environment, content_view)
        content_view_version = content_view.version(lifecycle_environment)

        # Find the first repo that has a distribution.
        # Note: at this time, the assumption is that there will only be 1 repo containing distro.
        repo = content_view_version.repositories.find{ |repo| repo.bootable_distribution }
        distribution = repo.bootable_distribution

        # Locate the operating system using the information from the distribution
        os_name = ::Redhat.construct_name(distribution.family)
        major, minor = distribution.version.split('.')
        minor ||= '' # treat minor versions as empty string to not confuse with nil

        ::Redhat.where(:name => os_name, :major => major, :minor => minor).first
      end

      def content_view_name(deployment_name)
        name = SETTINGS[:fusor][:content][:content_view][:composite_view_name]
        return [name, deployment_name].join(' - ') if name
      end

      def activation_key_name(deployment_name)
        name = SETTINGS[:fusor][:activation_key][:name]
        return [name, deployment_name].join(' - ') if name
      end
    end
  end
end
