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
      class PublishContentView < Actions::Fusor::FusorBaseAction
        def humanized_name
          _("Publish Content View")
        end

        def plan(deployment, repositories)
          super(deployment)
          unless composite_content_view_name(deployment) &&
                 rpm_content_view_name &&
                 puppet_content_view_name
            fail _("Unable to locate content view settings in config/settings.plugins.d/fusor.yaml")
          end

          sequence do
            composite_view = find_or_create_content_view(deployment.organization,
                                                         composite_content_view_name(deployment),
                                                         true)

            rpm_view = find_or_create_content_view(deployment.organization, rpm_content_view_name)
            repo_ids = repositories.map(&:id)
            unless repo_ids.blank? || repo_ids.to_set.subset?(rpm_view.repository_ids.to_set)
              plan_action(::Actions::Katello::ContentView::Update, rpm_view, :repository_ids => repo_ids)
              plan_action(::Actions::Katello::ContentView::Publish, rpm_view)
            end
            rpm_view_version = rpm_view.version(deployment.organization.library)

            #The puppet view is created during the seeding of the plugin; therefore, we should not need to create it
            puppet_view = find_content_view(deployment.organization, puppet_content_view_name)
            puppet_view_version = puppet_view.try(:version, deployment.organization.library)

            component_version_ids = [rpm_view_version.id, puppet_view_version.try(:id)].compact
            unless component_version_ids.blank? ||
                   component_version_ids.to_set.subset?(composite_view.component_ids.to_set)
              plan_action(::Actions::Katello::ContentView::Update, composite_view,
                          :component_ids => component_version_ids)
              plan_action(::Actions::Katello::ContentView::Publish, composite_view)
            end

            # Promote content view to target lifecycle environment, if needed
            unless deployment.lifecycle_environment.library? ||
                   (composite_view.version(deployment.organization.library) ==
                    composite_view.version(deployment.lifecycle_environment))
              plan_action(::Actions::Katello::ContentView::Promote,
                          composite_view.version(deployment.organization.library),
                          deployment.lifecycle_environment)
            end

            plan_self(:content_view_id => composite_view.id,
                      :environment_id => deployment.lifecycle_environment.id)
          end
        end

        def run
          content_view = ::Katello::ContentView.find(input[:content_view_id])
          environment  = ::Katello::KTEnvironment.find(input[:environment_id])

          # The foreman puppet environment is typically updated in the finalize phase
          # of content publish/promotion; however, we need this to occur earlier,
          # since we'll need the puppet classes created by the update.
          ::Katello::Foreman.update_puppet_environment(content_view, environment)
        end

        private

        def find_or_create_content_view(organization, view_name, composite = false)
          if view_name
            unless view = find_content_view(organization, view_name)
              view = ::Katello::ContentView.create!(:organization_id => organization.id,
                                                    :name => view_name,
                                                    :composite => composite)
            end
          end
          view
        end

        def find_content_view(organization, view_name)
          ::Katello::ContentView.where(:organization_id => organization.id, :name => view_name).first
        end

        def composite_content_view_name(deployment)
          name = SETTINGS[:fusor][:content][:content_view][:composite_view_name]
          return [name, deployment.label].join(' - ') if name
        end

        def rpm_content_view_name
          SETTINGS[:fusor][:content][:content_view][:rpm_component_view_name]
        end

        def puppet_content_view_name
          SETTINGS[:fusor][:content][:content_view][:puppet_component_view_name]
        end
      end
    end
  end
end
