#
# Copyright 2014 Red Hat, Inc.
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

module Actions::Fusor::Host
  class IntrospectOpenStackNode < Actions::Base
    include Actions::Base::Polling

    input_format do
      param :deployment_id
      param :node_id
    end

    def plan(deployment, node_id)
      plan_self node_id: node_id, deployment_id: deployment.id
    end

    def done?
      external_task
    end

    # only one interval, 20 seconds between poll attempts
    def poll_intervals
      [20]
    end

    def invoke_external_task
      false # it's not done yet, return false so we'll start polling
    end

    def poll_external_task
      deployment = ::Fusor::Deployment.find(input[:deployment_id])
      # returns true if node introspection is done, which is what this
      # method wants as a return so it works out swimingly
      undercloud_handle(deployment).introspect_node_status(input[:node_id])
    end

    def run_progress
      # We currently have no way of getting a real progress update out of the
      # OSP Director. It takes about 5 minutes, let's just make the progres
      # bar move to indicate something is happening.
      # Start at 10% (node creation, already done) and max out at 90% (for
      # flavor creation afterwards).
      # 10% + (time_we've_been_polling / 5 minutes) * 80%
      # The () bit above always returns a max of 1, so that we don't
      # overshoot 100% if it happens to take longer than 5 minutes.
      0.1 + [(poll_attempts[:total] * poll_intervals[0]) / 300.0, 1].min * 0.8
    end

    private

    def undercloud_handle(deployment)
      return Overcloud::UndercloudHandle.new('admin', deployment.openstack_undercloud_password, deployment.openstack_undercloud_ip_addr, 5000)
    end
  end
end
