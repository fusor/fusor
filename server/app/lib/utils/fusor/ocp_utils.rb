##
# OcpUtils
# =================
# Shared utility functions for OpenShift deployments

module Utils
  module Fusor
    class OcpUtils
      # Utils::Fusor::OcpUtils.parse_deployment(deployment)
      def self.parse_deployment(deployment)
        opts = Hash.new

        masters = Array.new
        deployment.ose_master_hosts.each do |m|
          masters << m.name
        end

        workers = Array.new
        deployment.ose_worker_hosts.each do |w|
          workers << w.name
        end

        ha_nodes = Array.new
        deployment.ose_ha_hosts.each do |ha|
          ha_nodes << ha.name
        end

        opts[:masters] = masters
        opts[:nodes] = workers
        opts[:ha_nodes] = ha_nodes

        if opts[:ha_nodes].length > 1
          opts[:ha_lb_master] = ha_nodes.first
          opts[:ha_lb_infra] = ha_nodes.last
        end

        opts[:username] = deployment.openshift_username
        opts[:ssh_key] = ::Utils::Fusor::SSHKeyUtils.new(deployment).get_ssh_private_key_path

        opts[:docker_registry_host] = deployment.openshift_storage_host
        opts[:docker_registry_path] = deployment.openshift_export_path

        opts[:docker_storage] = "/dev/vdb"
        opts[:docker_volume] = "docker-vg"
        opts[:storage_type] = deployment.openshift_storage_type

        opts[:ose_user] = deployment.openshift_username
        opts[:ose_password] = deployment.openshift_user_password

        opts[:subdomain_name] = deployment.openshift_subdomain_name + '.' + Domain.find(Hostgroup.find_by_name('Fusor Base').domain_id).name
        opts[:helloworld_sample_app] = deployment.openshift_sample_helloworld

        opts[:org_label] = Organization.find(deployment.organization_id).label.downcase
        opts[:satellite_hostname] = `/usr/bin/hostname`.chomp

        opts
      end
    end
  end
end
