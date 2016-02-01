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
      module OpenStack
        # Workaround BZ1302858 https://bugzilla.redhat.com/show_bug.cgi?id=1302858
        class UndercloudNoHostWorkaround < Actions::Fusor::FusorBaseAction
          def humanized_name
            _('Workaround BZ1302858')
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.debug '====== UndercloudNoHostWorkaround run method ======'
            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            restart_undercloud_services(deployment)
            ::Fusor.log.debug '=== Leaving UndercloudNoHostWorkaround run method ==='
          end

          private

          def restart_undercloud_services(deployment)
            client = Net::SSH.start(deployment.openstack_undercloud_ip_addr, 'root',
                                    :password => deployment.openstack_undercloud_user_password)
            ["openstack-ironic-api", "openstack-ironic-conductor", "openstack-ironic-discoverd-dnsmasq",
             "openstack-ironic-discoverd", "openstack-nova-api", "openstack-nova-compute",
             "openstack-nova-conductor", "openstack-nova-consoleauth", "openstack-nova-scheduler"].each do |service|
              client.exec!("systemctl restart #{service}")
            end
          end
        end
      end
    end
  end
end
