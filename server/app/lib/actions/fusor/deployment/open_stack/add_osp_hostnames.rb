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
        class AddOspHostnames < Actions::Fusor::FusorBaseAction
          def humanized_name
            _('')
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            Rails.logger.debug '====== AddOspHostnames run method ======'
            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            domain = Domain.find(Hostgroup.find_by_name('Fusor Base').domain_id)
            deployment.openstack_overcloud_hostname = "#{deployment.label.tr('_', '-')}-overcloud.#{domain}"
            deployment.openstack_undercloud_hostname = "#{deployment.label.tr('_', '-')}-undercloud.#{domain}"
            deployment.save!(:validate => false)
            overcloud = Net::DNS::ARecord.new(:ip => deployment.openstack_overcloud_address,
                                              :hostname => deployment.openstack_overcloud_hostname,
                                              :proxy => domain.proxy)
            overcloud.create
            undercloud = Net::DNS::ARecord.new(:ip => deployment.openstack_undercloud_ip_addr,
                                               :hostname => deployment.openstack_undercloud_hostname,
                                               :proxy => domain.proxy)
            undercloud.create
            Rails.logger.debug '=== Leaving AddOspHostnames run method ==='
          end

        end
      end
    end
  end
end
