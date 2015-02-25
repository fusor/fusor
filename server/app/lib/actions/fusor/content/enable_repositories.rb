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
      class EnableRepositories < Actions::Base
        def humanized_name
          _("Enable Repositories")
        end

        def plan(deployment)
          sequence do
            unless content = SETTINGS[:fusor][:content]
              fail _("fusor.yaml is missing definition for fusor content.")
            end

            products_enabled = [deployment.deploy_rhev, deployment.deploy_cfme, deployment.deploy_openstack]
            products_content = [content[:rhev], content[:cloudforms], content[:openstack]]

            products_enabled.each_with_index do |product_enabled, index|
              if product_enabled && products_content[index]
                products_content[index].each { |details| enable_repo(deployment.organization, details) }
              end
            end
          end
        end

        private

        def enable_repo(organization, repo_details)
          product = ::Katello::Product.where(:organization_id => organization.id,
                                             :name => repo_details[:product_name]).first

          if product
            product_content = product.productContent.find do |content|
              content.content.name == repo_details[:repository_set_name]
            end

            substitutions = { basearch: repo_details[:basearch], releasever: repo_details[:releasever] }
            if repo_mapper(product, product_content.content, substitutions).find_repository
              Rails.logger.info("Repository already enabled for: Product: #{product.name},"\
                                " Repository Set: #{product_content.content.name}")
            else
              plan_action(::Actions::Katello::RepositorySet::EnableRepository, product,
                          product_content.content, substitutions)
            end
          else
            fail _("Product '%{product_name}' does not exist. Confirm that a manifest"\
                   " containing it has been imported.") % { :product_name => repo_details[:product_name] }
          end
        end

        def repo_mapper(product, content, substitutions)
          ::Katello::Candlepin::Content::RepositoryMapper.new(product, content, substitutions)
        end
      end
    end
  end
end
