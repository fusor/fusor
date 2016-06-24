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
          fail _("Unable to locate puppet class settings in config/settings.plugins.d/fusor.yaml") unless SETTINGS[:fusor][:puppet_classes]

          sequence do
            content = SETTINGS[:fusor][:content]
            host_groups = SETTINGS[:fusor][:host_groups]

            # TODO: Move to host groups?
            enable_smart_class_parameter_overrides

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

            plan_action(::Actions::Fusor::Content::SyncRepositories, repositories)

            plan_action(::Actions::Fusor::Content::PublishContentView,
                        deployment,
                        yum_repositories(repositories)) if deployment.lifecycle_environment_id
          end
        end

        private

        def enable_smart_class_parameter_overrides
          # Enable parameter overrides for all parameters supported by the configured puppet classes
          puppet_classes = ::Puppetclass.where(:name => SETTINGS[:fusor][:puppet_classes].map { |p| p[:name] })
          puppet_classes.each do |puppet_class|
            puppet_class.smart_class_parameters.each do |parameter|
              unless parameter.override
                parameter.override = true
                parameter.save!
              end
            end
          end
        end

      end
    end
  end
end
