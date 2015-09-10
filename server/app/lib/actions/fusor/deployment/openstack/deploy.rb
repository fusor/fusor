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
require 'egon'

module Actions::Fusor::Deployment::OpenStack
  class Deploy < Actions::Base
    include Actions::Base::Polling

    input_format do
      param :deployment_id
    end

    def humanized_name
      _("Deploy Red Hat OpenStack Platform overcloud")
    end

    def plan(deployment)
      fail _("Unable to locate a RHEL OSP undercloud") unless deployment.openstack_undercloud_password
      plan_self(deployment_id: deployment.id)
    end

    def done?
      external_task
    end

    def invoke_external_task
      deployment = ::Fusor::Deployment.find(input[:deployment_id])
      undercloud_handle(deployment).deploy_plan('overcloud')
      false # it's not done yet, return false so we'll start polling
    end

    def poll_external_task
      deployment = ::Fusor::Deployment.find(input[:deployment_id])
      stack = undercloud_handle(deployment).get_stack_by_name('overcloud')
      if stack.nil?
        fail "ERROR: deployment not found on undercloud."
      end
      if stack.stack_status == 'CREATE_COMPLETE'
        return true # done!
      elsif stack.stack_status == 'CREATE_IN_PROGRESS'
        return false # not done yet, try again later
      else
        fail "ERROR: deployment failed with status: " + stack.stack_status + " and reason: " + stack.stack_status_reason # errored, barf
      end
    end

    private

    def undercloud_handle(deployment)
      return Overcloud::UndercloudHandle.new('admin', deployment.openstack_undercloud_password, deployment.openstack_undercloud_ip_addr, 5000)
    end
  end
end
