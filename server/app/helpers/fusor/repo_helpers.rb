module Fusor
  module RepoHelpers

    PRODUCT_MAP = {
      rhev: [
        :rhevm,
        :rhevh,
        :rhevsh
      ],
      cfme: [
        :cloudforms
      ],
      openstack: [
        :openstack
      ],
      openshift: [
        :openshift
      ]
    }

    def retrieve_deployment_repositories(organization, product_content)
      repos = []
      product_content.each { |details| repos << find_repository(organization, details) }
      repos
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

    def yum_repositories(repositories)
      repositories.select { |repo| repo.content_type == ::Katello::Repository::YUM_TYPE }
    end

    def repository_mapper(product, content, substitutions)
      ::Katello::Candlepin::Content::RepositoryMapper.new(product, content, substitutions)
    end

  end
end
