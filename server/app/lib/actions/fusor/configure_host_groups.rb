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
          else
            lifecycle_environment = deployment.organization.library
          end


          hostgroup_params = { :parent_id => parent.try(:id),
                               :organization_ids => [organization_id] }

          if name_setting = hostgroup_settings[:name]
            # this host group is a child of the deployment group
            hostgroup_params[:name] = name_setting
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
              insights_class = Puppetclass.find_by_name("access_insights_client")
              hostgroup_params[:puppetclass_ids] = [insights_class.id]
            end

            default_capsule_id = ::Katello::CapsuleContent.default_capsule.try(:capsule).try(:id)

            hostgroup_params[:name] = deployment.label
            hostgroup_params[:title] = deployment.label
            hostgroup_params[:lifecycle_environment_id] = lifecycle_environment.id
            hostgroup_params[:environment_id] = Environment.where(:name => 'production').first.id
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
          'Intel Conroe Family' => 'model_Conroe',
          'Intel Penryn Family' => 'model_Penryn',
          'Intel Nehalem Family' => 'model_Nehalem',
          'Intel Westmere Family' => 'model_Westmere',
          'Intel SandyBridge Family' => 'model_SandyBridge',
          'Intel Haswell Family' => 'model_Haswell',
          'Intel Haswell-noTSX Family' => 'model_Haswell-noTSX',
          'Intel Broadwell Family' => 'model_Broadwell',
          'Intel Broadwell-noTSX Family' => 'model_Broadwell-noTSX',
          'AMD Opteron G1' => 'model_Opteron_G1',
          'AMD Opteron G2' => 'model_Opteron_G2',
          'AMD Opteron G3' => 'model_Opteron_G3',
          'AMD Opteron G4' => 'model_Opteron_G4',
          'AMD Opteron G5' => 'model_Opteron_G5',
          # 'IBM POWER 8' => 'UNSUPPORTED',
        }
        return self_hosted_cpu_map[cpu_type]
      end

      def get_mac_address_range(deployment_id)
        fail _('Too many deployments to generate a unique mac address pool') if deployment_id > 255
        identifier = deployment_id.to_s(16).rjust(2, '0')
        start = "00:1A:#{identifier}:00:00:00"
        end_ = "00:1A:#{identifier}:FF:FF:FF"
        "#{start},#{end_}"
      end
    end
  end
end
