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
    class ConfigureHostGroupsForProducts < Actions::Fusor::FusorBaseAction
      include ::Fusor::RepoHelpers

      def humanized_name
        _("Configure Host Groups For Products")
      end

      def plan(deployment_id)
        deployment = ::Fusor::Deployment.find(deployment_id)
        super(deployment)

        sequence do
          host_groups = SETTINGS[:fusor][:host_groups]

          PRODUCT_MAP.keys.each do |deploy|
            hostgroup = host_groups[deploy]

            if deployment.deploy?(deploy) && hostgroup
              configure_activation_keys(deployment, hostgroup)

              plan_action(::Actions::Fusor::ConfigureHostGroups,
                          deployment,
                          deploy,
                          hostgroup)
            end
          end
        end
      end

      private

      def configure_activation_keys(deployment, hostgroup)
        content = SETTINGS[:fusor][:content]

        hostgroup[:host_groups].each do |subgroup|
          next unless subgroup[:activation_key]

          content_key = subgroup[:activation_key][:content]
          product_content = content[content_key]

          # find the subset of repos that belong to this activation key
          repositories = retrieve_deployment_repositories(deployment.organization, product_content)
          repositories = yum_repositories(repositories)

          plan_action(
            ::Actions::Fusor::ActivationKey::ConfigureActivationKey,
            deployment,
            subgroup,
            repositories)
        end
      end

    end
  end
end
