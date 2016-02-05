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

require 'fog'

module Actions
  module Fusor
    module Deployment
      module OpenStack
        #Configure CFME Security Group
        class CfmeSecgroup < Actions::Fusor::FusorBaseAction
          def humanized_name
            _('Configure CFME Security Group')
          end

          def plan(deployment)
            super(deployment)
            plan_self(deployment_id: deployment.id)
          end

          def run
            ::Fusor.log.debug '====== CFME Security Group run method ======'
            deployment = ::Fusor::Deployment.find(input[:deployment_id])
            overcloud = { :openstack_auth_url  => "http://#{deployment.openstack_overcloud_address}:5000/v2.0/tokens",
                          :openstack_username  => 'admin', :openstack_tenant => 'admin',
                          :openstack_api_key   => deployment.openstack_overcloud_password }
            keystone = Fog::Identity::OpenStack.new(overcloud)
            tenant = keystone.get_tenants_by_name(deployment.label).body["tenant"]

            neutron = Fog::Network::OpenStack.new(overcloud)
            sec_group = neutron.security_groups.create :name => "#{deployment.label}-sec-group", :tenant_id => tenant['id']

            [22, 80, 443].each do |port|
              create_tcp_rule(neutron, sec_group, port)
            end

            create_icmp_rule(neutron, sec_group)
            ::Fusor.log.debug '====== Leaving CFME Security Group run method ======'
          end

          def cfme_secgroup_completed
            ::Fusor.log.info 'CFME Security Group Creation Completed'
          end

          def cfme_secgroup_failed
            fail _('CFME Security Group Creation failed')
          end

          private

          def create_tcp_rule(neutron, sec_group, port)
            neutron.security_group_rules.create :security_group_id => sec_group.id, :remote_group_id => nil,
                                                :direction => "ingress", :remote_ip_prefix => '0.0.0.0/0',
                                                :protocol  => 'tcp', :ethertype => "IPv4", :port_range_max => port,
                                                :port_range_min => port
          end

          def create_icmp_rule(neutron, sec_group)
            neutron.security_group_rules.create :security_group_id => sec_group.id, :remote_group_id => nil,
                                                :direction => "ingress", :remote_ip_prefix => '0.0.0.0/0',
                                                :protocol  => 'icmp', :ethertype => "IPv4"
          end
        end
      end
    end
  end
end
