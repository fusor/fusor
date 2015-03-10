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
      class ConfigureActivationKey < Actions::Base
        def humanized_name
          _("Configure Activation Key")
        end

        def plan(organization, lifecycle_environment)
          unless activation_key_name
            fail _("Unable to locate activation key settings in config/settings.plugins.d/fusor.yaml")
          end

          unless content_view_name
            fail _("Unable to locate content settings in config/settings.plugins.d/fusor.yaml")
          end

          unless content_view = find_content_view(organization)
            fail _("Unable to locate content view '%s'.") % content_view_name
          end

          sequence do
            find_or_ensure_key(organization, lifecycle_environment, content_view)
            # TODO: update to support UpdateSubscriptions, which could add or remove based
            # on changes in configuration... not urgent, since currently there is only a single
            # subscription in the configuration
            plan_action(::Actions::Fusor::ActivationKey::AddSubscriptions, organization)
          end
        end

        private

        def find_or_ensure_key(organization, lifecycle_environment, content_view)
          key = ::Katello::ActivationKey.where(:organization_id => organization.id,
                                               :name => activation_key_name).first
          if key
            attributes = { :name => activation_key_name,
                           :organization_id => organization.id,
                           :environment_id => lifecycle_environment.id,
                           :content_view_id => content_view.id,
                           :auto_attach => true,
                           :user_id => ::User.current.id }

            plan_action(::Actions::Katello::ActivationKey::Update, key, attributes)
          else
            key = ::Katello::ActivationKey.new(:name => activation_key_name,
                                               :organization_id => organization.id,
                                               :environment_id => lifecycle_environment.id,
                                               :content_view_id => content_view.id,
                                               :auto_attach => true,
                                               :user_id => ::User.current.id)

            plan_action(::Actions::Katello::ActivationKey::Create, key)
          end
        end

        def find_content_view(organization)
          ::Katello::ContentView.where(:organization_id => organization.id, :name => content_view_name).first
        end

        def content_view_name
          SETTINGS[:fusor][:content][:content_view][:composite_view_name]
        end

        def activation_key_name
          SETTINGS[:fusor][:activation_key][:name]
        end
      end
    end
  end
end