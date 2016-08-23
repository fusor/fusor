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
      class AddSubscriptions < Actions::Fusor::FusorBaseAction
        def humanized_name
          _("Activation Key - Add Subscriptions")
        end

        def plan(activation_key_id, hostgroup, subscription_descriptions, repositories)
          super()
          key = ::Katello::ActivationKey.find_by_id(activation_key_id)

          fail _("Unable to add subscriptions without an activation key") unless key
          unless subscription_descriptions
            fail _("Unable to locate activation key settings in config/settings.plugins.d/fusor.yaml")
          end

          plan_self(:activation_key_id => activation_key_id,
                    :hostgroup => hostgroup,
                    :subscription_descriptions => subscription_descriptions,
                    :user_id => ::User.current.id,
                    :repository_cp_labels => repositories.map(&:cp_label))
        end

        def run
          ::User.current = ::User.find(input[:user_id])
          key = ::Katello::ActivationKey.find(input[:activation_key_id])
          associate_subscriptions(key, input[:hostgroup])
          enable_repositories(key, input[:repository_cp_labels])
        ensure
          ::User.current = nil
        end

        private

        def associate_subscriptions(key, hostgroup)
          product_name = hostgroup[:activation_key][:content].parameterize.underscore.to_sym
          products = SETTINGS[:fusor][:content][product_name].map { |p| p[:product_id] }.uniq
          key.available_subscriptions.find_all.each do |sub|
            if !sub.products.nil?
              add = false
              products.each do |p|
                if sub.products.find_all { |product| product.cp_id == p }.length > 0
                  add = true
                end
              end
              if add
                ::Fusor.log.info "Adding subscription #{sub.id} to activation key #{key.id}"
                key.subscribe(sub.id, 0)
              end
            end
          end
        end

        def enable_repositories(key, repository_cp_labels)
          repository_cp_labels.each do |cp_label|
            key.set_content_override(cp_label, 'enabled', 1)
          end
        end
      end
    end
  end
end
