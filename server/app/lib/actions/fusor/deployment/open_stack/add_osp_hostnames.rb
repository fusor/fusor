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
            ::Fusor.log.debug '====== AddOspHostnames run method ======'
            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            openstack_deployment = deployment.openstack_deployment
            hostname_prefix = deployment.label.tr('_', '-')
            domain = Domain.find(Hostgroup.find_by_name('Fusor Base').domain_id)
            openstack_deployment.overcloud_hostname = "#{hostname_prefix}-overcloud.#{domain}"
            openstack_deployment.undercloud_hostname = "#{hostname_prefix}-undercloud.#{domain}"
            openstack_deployment.save!(:validate => false)
            overcloud = Net::DNS::ARecord.new(:ip => deployment.openstack_deployment.overcloud_address,
                                              :hostname => deployment.openstack_deployment.overcloud_hostname,
                                              :proxy => domain.proxy)
            overcloud.create
            undercloud = Net::DNS::ARecord.new(:ip => openstack_deployment.undercloud_ip_address,
                                               :hostname => openstack_deployment.undercloud_hostname,
                                               :proxy => domain.proxy)
            undercloud.create
            ::Fusor.log.debug '=== Leaving AddOspHostnames run method ==='
          end

        end
      end
    end
  end
end
