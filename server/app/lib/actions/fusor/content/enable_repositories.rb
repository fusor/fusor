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

        def plan(organization, product_content_settings)
          sequence do
            fail _("fusor.yaml is missing definition for fusor content.") unless product_content_settings
            product_content_settings.each { |details| enable_repo(organization, details) }
          end
        end

        private

        def enable_repo(organization, repo_details)
          product = ::Katello::Product.where(:organization_id => organization.id,
                                             :cp_id => repo_details[:product_id]).first

          unless product
            fail _("Product '%{product_name}' does not exist. Confirm that a manifest"\
                   " containing it has been imported.") % { :product_name => repo_details[:product_name] }
          end

          product_content = product.productContent.find do |content|
            content.content.id == repo_details[:repository_set_id]
          end

          unless product_content
            fail _("Repository set '%{product_name} - %{repository_set_name}' does not exist. Confirm that a manifest "\
                   "containing it has been imported.") % repo_details.slice(:product_name, :repository_set_name)
          end

          substitutions = { basearch: repo_details[:basearch] }
          substitutions[:releasever] = repo_details[:releasever] if repo_details[:releasever]
          if repo_mapper(product, product_content.content, substitutions).find_repository
            Rails.logger.info("Repository already enabled for: Product: #{product.name},"\
                              " Repository Set: #{product_content.content.name}")
          else
            plan_action(::Actions::Katello::RepositorySet::EnableRepository, product,
                        product_content.content, substitutions)
          end
        end

        def repo_mapper(product, content, substitutions)
          ::Katello::Candlepin::Content::RepositoryMapper.new(product, content, substitutions)
        end
      end
    end
  end
end
