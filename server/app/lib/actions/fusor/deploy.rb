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
    class Deploy < Actions::Fusor::FusorEntryAction
      def humanized_name
        _("Deploy %s" % input[:deployment_name])
      end

      def plan(deployment, skip_content = false)
        super(deployment)
        #Follow and append satellite specific logging
        ::Fusor.start_collect_satellite_logs(deployment.label, deployment.id)
        fail _("Unable to locate fusor.yaml settings in config/settings.plugins.d") unless SETTINGS[:fusor]
        fail _("Unable to locate content settings in config/settings.plugins.d/fusor.yaml") unless SETTINGS[:fusor][:content]
        fail _("Unable to locate host group settings in config/settings.plugins.d/fusor.yaml") unless SETTINGS[:fusor][:host_groups]
        sequence do

          plan_action(::Actions::Fusor::Deployment::PrepareOrg::Prepare, deployment)

          unless skip_content
            plan_action(::Actions::Fusor::Content::ManageContentAsSubPlan,
                        deployment)
          end

          concurrence do
            if deployment.deploy_rhev
              plan_action(::Actions::Fusor::Deployment::Rhev::DeployAsSubPlan,
                          deployment)
            end

            if deployment.deploy_openstack
              plan_action(::Actions::Fusor::Deployment::OpenStack::DeployAsSubPlan,
                          deployment)
            end
          end

          if deployment.deploy_openshift
            plan_action(::Actions::Fusor::Deployment::OpenShift::DeployAsSubPlan,
                        deployment)
          end

          if deployment.deploy_cfme
            plan_action(::Actions::Fusor::Deployment::CloudForms::DeployAsSubPlan,
                        deployment)
          end
        end
        plan_self(:deployment_label => deployment.label, :deployment_id => deployment.id)
      end

      def finalize
        ::Fusor.stop_collect_satellite_logs(input[:deployment_label], input[:deployment_id])
      end
    end
  end
end
