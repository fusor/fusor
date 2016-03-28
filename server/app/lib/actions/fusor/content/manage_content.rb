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
            product_map = {rhev: [:rhevm, :rhevh, :rhevsh],
                           cfme: [:cloudforms],
                           openstack: [:openstack],
                           openshift: [:openshift]
            }

            enable_smart_class_parameter_overrides

            product_content_details = product_map.each_with_object([]) do |(deploy, product_types), details|
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

            product_map.keys.each do |deploy|
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

        def yum_repositories(repositories)
          repositories.select { |repo| repo.content_type == ::Katello::Repository::YUM_TYPE }
        end

        def retrieve_deployment_repositories(organization, product_content)
          repos = []
          product_content.each { |details| repos << find_repository(organization, details) }
          repos
        end

        def configure_activation_keys(deployment, hostgroup)
          content = SETTINGS[:fusor][:content]

          hostgroup[:host_groups].each do |subgroup|
            next unless subgroup[:activation_key]

            content_key = subgroup[:activation_key][:content]
            product_content = content[content_key]

            # find the subset of repos that belong to this activation key
            repositories = retrieve_deployment_repositories(deployment.organization, product_content)
            repositories = yum_repositories(repositories)

            plan_action(::Actions::Fusor::ActivationKey::ConfigureActivationKey,
                        deployment,
                        subgroup,
                        repositories
                       )
          end
        end

        def find_repository(organization, repo_details)
          product = ::Katello::Product.where(:organization_id => organization.id,
                                             :cp_id => repo_details[:product_id]).first

          if product
            product_content = product.productContent.find do |content|
              content.content.id == repo_details[:repository_set_id]
            end

            substitutions = { basearch: repo_details[:basearch], releasever: repo_details[:releasever] }
            unless repository = repository_mapper(product, product_content.content, substitutions).find_repository
              fail _("Unable to locate repository for: Product '%{product_name}',"\
                   " Repository Set '%{repo_set_name}'") %
                       { :product_name => product.name, :repo_set_name => product_content.content.name }
            end
          else
            fail _("Product '%{product_name}' does not exist. Confirm that a manifest"\
                 " containing it has been imported.") % { :product_name => repo_details[:product_name] }
          end
          repository
        end

        def repository_mapper(product, content, substitutions)
          ::Katello::Candlepin::Content::RepositoryMapper.new(product, content, substitutions)
        end

      end
    end
  end
end
