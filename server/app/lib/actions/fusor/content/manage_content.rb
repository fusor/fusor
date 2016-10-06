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
    module Content
      class ManageContent < Actions::Fusor::FusorBaseAction
        include ::Fusor::RepoHelpers

        def humanized_name
          _("Manage Content")
        end

        def plan(deployment)
          super(deployment)
          fail _("Unable to locate fusor.yaml settings in config/settings.plugins.d") unless SETTINGS[:fusor]
          fail _("Unable to locate content settings in config/settings.plugins.d/fusor.yaml") unless SETTINGS[:fusor][:content]
          fail _("Unable to locate host group settings in config/settings.plugins.d/fusor.yaml") unless SETTINGS[:fusor][:host_groups]

          sequence do
            content = SETTINGS[:fusor][:content]

            product_content_details = PRODUCT_MAP.each_with_object([]) do |(deploy, product_types), details|
              details << product_types.map { |type| content[type] } if deployment.deploy?(deploy)
            end
            product_content_details = product_content_details.flatten(2).uniq.compact

            plan_action(::Actions::Fusor::Content::EnableRepositories,
                        deployment.organization,
                        product_content_details)

            # As part of enabling repositories, zero or more repos will be created.  Let's
            # retrieve the repos needed for the deployment and use them in actions that follow
            repositories = retrieve_deployment_repositories(deployment.organization, product_content_details)

            if deployment.deploy_openshift
              SETTINGS[:fusor][:docker_repos].each do |docker_repo|
                repositories << ::Katello::Repository.find_by_name(docker_repo[:name])
              end
            end

            plan_action(::Actions::Fusor::Content::SyncRepositories, repositories)

            plan_action(::Actions::Fusor::Content::PublishContentView,
                        deployment,
                        yum_repositories(repositories)) if deployment.lifecycle_environment_id
          end
        end
      end
    end
  end
end
