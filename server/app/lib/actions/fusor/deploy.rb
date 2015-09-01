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

      def plan(deployment, skip_content = false)
        fail _("Unable to locate fusor.yaml settings in config/settings.plugins.d") unless SETTINGS[:fusor]
        fail _("Unable to locate content settings in config/settings.plugins.d/fusor.yaml") unless SETTINGS[:fusor][:content]
        fail _("Unable to locate host group settings in config/settings.plugins.d/fusor.yaml") unless SETTINGS[:fusor][:host_groups]

        sequence do
          unless skip_content
            plan_action(::Actions::Fusor::Content::ManageContentAsSubPlan,
                        deployment)
          end

          if deployment.deploy_rhev
            plan_action(::Actions::Fusor::Deployment::Rhev::DeployAsSubPlan,
                        deployment)
          end

          if deployment.deploy_openstack
            plan_action(::Actions::Fusor::Deployment::OpenStack::DeployAsSubPlan,
                        deployment)
          end

          if deployment.deploy_cfme
            plan_action(::Actions::Fusor::Deployment::CloudForms::DeployAsSubPlan,
                        deployment)
          end
        end
      end
    end
  end
end
