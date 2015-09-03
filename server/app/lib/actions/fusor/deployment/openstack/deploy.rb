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
    def humanized_name
      _("Deploy Red Hat OpenStack Platform overcloud")
    end

    def plan(deployment)
      fail _("Unable to locate a RHEL OSP undercloud") unless deployment.openstack_undercloud_password
      plan_self(deployment_id: deployment.id)
    end

    def run
      @plan = undercloud_handle.deploy_plan('overcloud')
    end

    private

    def hosts_to_provision(deployment)
      deployment.discovered_hosts + [deployment.rhev_engine_host]
    end

    def undercloud_handle
      return Overcloud::UndercloudHandle.new('admin', '27f71320a3ab816412a47120ca370a7441c79b6e', '192.0.2.1', 5000)
    end
  end
end
