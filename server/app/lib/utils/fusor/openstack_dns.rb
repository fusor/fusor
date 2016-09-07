require 'fog'

module Utils
  module Fusor
    class OpenstackDNS

      def initialize(openstack_deployment)
        @openstack_deployment = openstack_deployment
      end

      def compare
        get_overcloud_dns == satellite_dns && get_undercloud_dns == satellite_dns
      end

      def update
        update_overcloud_dns
        update_undercloud_dns
        compare
      end

      private

      def undercloud
        { :openstack_auth_url  => "http://#{@openstack_deployment.undercloud_ip_address}:5000/v2.0/tokens",
          :openstack_username  => 'admin', :openstack_tenant => 'admin',
          :openstack_api_key   => @openstack_deployment.undercloud_admin_password }
      end

      def get_overcloud_dns
        neutron = Fog::Network::OpenStack.new(undercloud)
        neutron.subnets.first.dns_nameservers.first
      end

      def get_undercloud_dns
        client = ::Utils::Fusor::SSHConnection.new(@openstack_deployment.undercloud_ip_address,
                                                   @openstack_deployment.undercloud_ssh_username,
                                                   @openstack_deployment.undercloud_ssh_password)
        io = StringIO.new
        client.execute('ruby -e "require \'resolv\'; puts Resolv::DNS::Config.new.lazy_initialize.nameserver_port.first.first"', io)
        undercloud_dns = io.string.chomp
        io.close if io && !io.closed?
        undercloud_dns
      end

      def update_overcloud_dns
        neutron = Fog::Network::OpenStack.new(undercloud)
        subnet = neutron.subnets.first
        subnet.dns_nameservers = [satellite_dns]
        subnet.update
      end

      def update_undercloud_dns
        client = ::Utils::Fusor::SSHConnection.new(@openstack_deployment.undercloud_ip_address,
                                                   @openstack_deployment.undercloud_ssh_username,
                                                   @openstack_deployment.undercloud_ssh_password)
        client.execute("echo nameserver #{satellite_dns} > /etc/resolv.conf")
      end

      def satellite_dns
        Subnet.find(Hostgroup.find_by_name('Fusor Base').subnet_id).dns_primary
      end
    end
  end
end
