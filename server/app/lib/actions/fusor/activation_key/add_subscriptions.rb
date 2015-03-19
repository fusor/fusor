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
      class AddSubscriptions < Actions::Base
        def humanized_name
          _("Activation Key - Add Subscriptions")
        end

        def plan(deployment)
          unless activation_key_name(deployment.name) && subscription_descriptions
            fail _("Unable to locate activation key settings in config/settings.plugins.d/fusor.yaml")
          end

          plan_self(:deployment_name => deployment.name,
                    :organization_id => deployment.organization.id,
                    :user_id => ::User.current.id)
        end

        def finalize
          ::User.current = ::User.find(input[:user_id])

          key = ::Katello::ActivationKey.where(:organization_id => input[:organization_id],
                                               :name => activation_key_name(input[:deployment_name])).first
          associate_subscriptions(key)
        ensure
          ::User.current = nil
        end

        private

        def associate_subscriptions(key)
          subscription_descriptions.each do |description|
            subscription = key.available_subscriptions.find{ |key| key.description == description }
            key.subscribe(subscription.cp_id) if subscription
          end
        end

        def activation_key_name(deployment_name)
          name = SETTINGS[:fusor][:activation_key][:name]
          return [name, deployment_name].join(' - ') if name
        end

        def subscription_descriptions
          SETTINGS[:fusor][:activation_key][:subscription_descriptions]
        end
      end
    end
  end
end
