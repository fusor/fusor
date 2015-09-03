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
    module Deployment
      module CloudForms
        class Deploy < Actions::Base
          def humanized_name
            _("Deploy CloudForms Management Engine")
          end

          def plan(deployment)
            Rails.logger.info "================ Planning CFME Deployment ===================="

            # VERIFY PARAMS HERE
            if deployment.deploy_cfme
              unless SETTINGS[:fusor] && SETTINGS[:fusor][:content] && SETTINGS[:fusor][:content][:cloudforms]
                fail _("Unable to locate CloudForms content settings in config/settings.plugins.d/fusor.yaml")
              end
              fail _("Unable to locate a RHEV export domain") unless deployment.rhev_export_domain_name
              fail _("Unable to locate a suitable host for CloudForms deployment") unless deployment.rhev_engine_host
              fail _("RHEV engine admin password not configured properly") unless deployment.rhev_engine_admin_password
            else
              Rails.logger.warn "Deploy CloudForms action scheduled but deploy_cfme was NOT selected. Please file a bug."
              return
            end

            sequence do
              repositories = retrieve_deployment_repositories(deployment.organization,
                                                              SETTINGS[:fusor][:content][:cloudforms])

              transfer_action = plan_action(::Actions::Fusor::Deployment::Rhev::TransferImage,
                                            deployment,
                                            file_repositories(repositories).first,
                                            image_file_name(SETTINGS[:fusor][:content][:cloudforms]))

              upload_action = plan_action(::Actions::Fusor::Deployment::Rhev::UploadImage,
                                          deployment,
                                          transfer_action.output[:image_file_name])

              plan_action(::Actions::Fusor::Deployment::Rhev::ImportTemplate,
                          deployment,
                          upload_action.output[:template_name])

              create_vm_action = plan_action(::Actions::Fusor::Deployment::Rhev::VirtualMachine::Create,
                                             deployment,
                                             upload_action.output[:template_name])

              plan_action(::Actions::Fusor::Deployment::Rhev::VirtualMachine::AddDisk,
                          deployment,
                          create_vm_action.output[:vm_id])

              plan_action(::Actions::Fusor::Deployment::Rhev::VirtualMachine::Start,
                          deployment,
                          create_vm_action.output[:vm_id])

              get_ip_action = plan_action(::Actions::Fusor::Deployment::Rhev::VirtualMachine::GetIp,
                                          deployment,
                                          create_vm_action.output[:vm_id])

              plan_action(::Actions::Fusor::Deployment::CloudForms::UpdateRootPassword,
                          deployment,
                          get_ip_action.output[:ip])

              plan_action(::Actions::Fusor::Deployment::CloudForms::RunApplianceConsole,
                          deployment,
                          get_ip_action.output[:ip])

              plan_action(::Actions::Fusor::Deployment::CloudForms::WaitForConsole,
                          get_ip_action.output[:ip])

              plan_action(::Actions::Fusor::Deployment::CloudForms::UpdateAdminPassword,
                          deployment,
                          get_ip_action.output[:ip])

              plan_action(::Actions::Fusor::Deployment::CloudForms::AddRhevProvider,
                          deployment,
                          get_ip_action.output[:ip])

              plan_action(::Actions::Fusor::Deployment::Update, deployment,
                          { cfme_address: get_ip_action.output[:ip] })
            end
          end

          private

          def retrieve_deployment_repositories(organization, product_content)
            repos = []
            product_content.each { |details| repos << find_repository(organization, details) }
            repos
          end

          def image_file_name(product_content)
            product = product_content.find { |content| !content[:image_file_name].nil? }
            product[:image_file_name] if product
          end

          def file_repositories(repositories)
            repositories.select { |repo| repo.content_type == ::Katello::Repository::FILE_TYPE }
          end

          def find_repository(organization, repo_details)
            product = ::Katello::Product.where(:organization_id => organization.id,
                                               :name => repo_details[:product_name]).first

            if product
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
  end
end
