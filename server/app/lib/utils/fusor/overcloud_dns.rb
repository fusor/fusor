require 'fog'

module Utils
  module Fusor
    class OvercloudDNS
      def compare(osp)
        get_overcloud_dns(osp) == satellite_dns
      end

      def update(osp)
        neutron = Fog::Network::OpenStack.new(undercloud(osp))
        subnet = neutron.subnets.first
        subnet.dns_nameservers = [satellite_dns]
        subnet.update
        compare(osp)
      end

      private

      def undercloud(osp)
        { :openstack_auth_url  => "http://#{osp.undercloud_ip_address}:5000/v2.0/tokens",
          :openstack_username  => 'admin', :openstack_tenant => 'admin',
          :openstack_api_key   => osp.undercloud_admin_password }
      end

      def get_overcloud_dns(osp)
        neutron = Fog::Network::OpenStack.new(undercloud(osp))
        neutron.subnets.first.dns_nameservers.first
      end

      def satellite_dns
        Subnet.find(Hostgroup.find_by_name('Fusor Base').subnet_id).dns_primary
      end
    end
  end
end
