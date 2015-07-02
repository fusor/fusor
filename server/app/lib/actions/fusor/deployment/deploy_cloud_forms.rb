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
      class DeployCloudForms < Actions::Base
        def humanized_name
          _("Deploy CloudForms Management Engine")
        end

        def plan(deployment, repository, image_file_name = nil)
          Rails.logger.info "================ Planning CFME Deployment ===================="

          # VERIFY PARAMS HERE
          if deployment.deploy_cfme
            fail _("CloudForms repository has not been provided.") unless repository
            fail _("Unable to locate a RHEV export domain") unless deployment.rhev_export_domain_name
            fail _("Unable to locate a suitable host for CloudForms deployment") unless deployment.rhev_engine_host
            fail _("RHEV engine admin password not configured properly") unless deployment.rhev_engine_admin_password
          else
            Rails.logger.warn "Deploy CloudForms action scheduled but deploy_cfme was NOT selected. Please file a bug."
            return
          end

          # TODO: Need to ensure that if rhev isn't up, we fail the action, but have the ability to resume/retry
          is_rhev_up = plan_action(::Actions::Fusor::Deployment::Rhev::IsUp, deployment)
          if is_rhev_up.output[:is_up]
            Rails.logger.info "================ RHEV is UP ===================="
            transfer_action = plan_action(::Actions::Fusor::Deployment::Rhev::TransferImage,
                                          deployment,
                                          repository,
                                          image_file_name)

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

            #TODO: if is_cloudforms_up(vm_ip), I guess we want to wait for it to come up instead of a simple true/false
            plan_action(::Actions::Fusor::Deployment::CloudForms::RunApplianceConsole,
                        deployment,
                        get_ip_action.output[:ip])

            plan_action(::Actions::Fusor::Deployment::CloudForms::AddRhevProvider,
                        deployment,
                        get_ip_action.output[:ip])
          else
            Rails.logger.info "================ RHEV is DOWN ===================="
          end
        end
      end
    end
  end
end
