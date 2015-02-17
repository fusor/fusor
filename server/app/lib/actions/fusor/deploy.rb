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
    class Deploy < Actions::EntryAction
      def humanized_name
        _("Deploy")
      end

      def plan(deployment)
        fail _("Unable to locate fusor.yaml settings in config/settings.plugins.d") unless SETTINGS[:fusor]

        sequence do
          # TODO: add an action to support importing a manifest created as part of the deployment

          plan_action(::Actions::Fusor::Content::EnableRepositories, deployment)

          # As part of enabling repositories, zero or more repos will be created.  Let's
          # retrieve the repos needed for the deployment and use them in actions that follow
          repositories = retrieve_deployment_repositories

          plan_action(::Actions::Fusor::Content::SyncRepositories, repositories)
          plan_action(::Actions::Fusor::Content::PublishContentView, deployment, repositories)
        end
      end

      private

      def retrieve_deployment_repositories
        repos = []
        if content = SETTINGS[:fusor][:content]
          [content[:rhev], content[:cloudforms], content[:openstack]].compact.flatten(1).each do |details|
            repos << find_repository(details)
          end
        end
        repos
      end

      def find_repository(repo_details)
        if product = ::Katello::Product.find_by_name(repo_details[:product_name])
          product_content = product.productContent.find do |content|
            content.content.name == repo_details[:repository_set_name]
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
