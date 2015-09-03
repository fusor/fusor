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

module Actions::Fusor::Deployment::OpenStack
  class DeployAsSubPlan < Actions::ActionWithSubPlans
    def humanized_name
      _("Deploy Red Hat OpenStack Platform overcloud as Sub Plan")
    end

    input_format do
      param :deployment_id, Integer
    end

    def plan(deployment)
      plan_self(:deployment_id => deployment.id)
    end

    def create_sub_plans
      trigger(::Actions::Fusor::Deployment::OpenStack::Deploy,
              ::Fusor::Deployment.find(input[:deployment_id]))
    end
  end
end
