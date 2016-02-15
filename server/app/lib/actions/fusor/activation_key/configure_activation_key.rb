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
    module ActivationKey
      class ConfigureActivationKey < Actions::Fusor::FusorBaseAction
        def humanized_name
          _("Configure Activation Key")
        end

        def plan(deployment, hostgroup, repositories)
          super(deployment)
          unless activation_key_name(deployment, hostgroup)
            fail _("Unable to locate activation key settings in config/settings.plugins.d/fusor.yaml")
          end

          unless content_view_name(deployment)
            fail _("Unable to locate content settings in config/settings.plugins.d/fusor.yaml")
          end

          unless content_view = find_content_view(deployment)
            fail _("Unable to locate content view '%s'.") % content_view_name(deployment)
          end

          sequence do
            key = find_or_ensure_key(deployment, content_view, hostgroup)
            # TODO: update to support UpdateSubscriptions, which could add or remove based
            # on changes in configuration... not urgent, since currently there is only a single
            # subscription in the configuration
            plan_action(::Actions::Fusor::ActivationKey::AddSubscriptions, key.id,
                        subscription_descriptions(hostgroup),
                        repositories)
          end
        end

        private

        def find_or_ensure_key(deployment, content_view, hostgroup)
          key = ::Katello::ActivationKey.where(:organization_id => deployment.organization.id,
                                               :name => activation_key_name(deployment, hostgroup)).first

          if key
            attributes = { :name => activation_key_name(deployment, hostgroup),
                           :organization_id => deployment.organization.id,
                           :environment_id => lifecycle_environment(deployment),
                           :content_view_id => content_view.id,
                           :auto_attach => true,
                           :user_id => ::User.current.id }

            plan_action(::Actions::Katello::ActivationKey::Update, key, attributes)
          else
            key = ::Katello::ActivationKey.new(:name => activation_key_name(deployment, hostgroup),
                                               :organization_id => deployment.organization.id,
                                               :environment_id => lifecycle_environment(deployment),
                                               :content_view_id => content_view.id,
                                               :auto_attach => true,
                                               :user_id => ::User.current.id)

            plan_action(::Actions::Fusor::ActivationKey::Create, key)
          end

          key
        end

        def find_content_view(deployment)
          ::Katello::ContentView.where(:organization_id => deployment.organization.id,
                                       :name => content_view_name(deployment)).first
        end

        def lifecycle_environment(deployment)
          if deployment.lifecycle_environment_id
            deployment.lifecycle_environment_id
          else
            deployment.organization.library.id
          end
        end

        def content_view_name(deployment)
          if deployment.lifecycle_environment_id
            name = SETTINGS[:fusor][:content][:content_view][:composite_view_name]
            [name, deployment.label].join(' - ') if name
          else
            deployment.organization.default_content_view.name
          end
        end

        def activation_key_name(deployment, hostgroup)
          return unless hostgroup[:activation_key] && hostgroup[:activation_key][:name]

          name = hostgroup[:activation_key][:name]
          hg_name = hostgroup[:name]
          [name, deployment.label, hg_name].map { |str| str.tr("-", "_") }.join('-')
        end

        def subscription_descriptions(hostgroup)
          hostgroup[:activation_key][:subscription_descriptions]
        end
      end
    end
  end
end
