require 'ip'

module Fusor
  module Validators
    class OpenstackDeploymentValidator < ActiveModel::Validator

      def validate(openstack_deployment)
        validate_overcloud openstack_deployment
        validate_ceph openstack_deployment
        validate_network openstack_deployment
      end

      private

      def validate_overcloud(openstack_deployment)
        if openstack_deployment.undercloud_admin_password.empty?
          openstack_deployment.errors[:undercloud_admin_password] << _('Openstack deployments must specify an admin password for the Undercloud')
        end

        if openstack_deployment.undercloud_ip_address.empty?
          openstack_deployment.errors[:undercloud_ip_address] << _('Openstack deployments must specify an ip address for the Undercloud')
        end

        if openstack_deployment.undercloud_ssh_username.empty?
          openstack_deployment.errors[:undercloud_ssh_username] << _('Openstack deployments must specify an ssh user for the Undercloud')
        end

        if openstack_deployment.undercloud_ssh_password.empty?
          openstack_deployment.errors[:undercloud_ssh_password] << _('Openstack deployments must specify an ssh password for the Undercloud')
        end

        if openstack_deployment.overcloud_deployed?
          openstack_deployment.errors[:overcloud_deployed] << _('Openstack deployments cannot be deployed to an Undercloud with an existing Overcloud')
        end

        if openstack_deployment.overcloud_password.empty?
          openstack_deployment.errors[:overcloud_password] << _('Openstack deployments must specify an admin password for the Overcloud')
        end

        if openstack_deployment.overcloud_ext_net_interface.empty?
          openstack_deployment.errors[:overcloud_ext_net_interface] << _('Openstack deployments must specify an external network interface for the Overcloud')
        end

        if openstack_deployment.overcloud_private_net.empty?
          openstack_deployment.errors[:overcloud_private_net] << _('Openstack deployments must specify a private network for the Overcloud')
        end

        if openstack_deployment.overcloud_float_net.empty?
          openstack_deployment.errors[:overcloud_float_net] << _('Openstack deployments must specify a floating network for the Overcloud')
        end

        if openstack_deployment.overcloud_float_gateway.empty?
          openstack_deployment.errors[:overcloud_float_gateway] << _('Openstack deployments must specify a floating network gateway for the Overcloud')
        end

        if openstack_deployment.overcloud_compute_flavor.empty?
          openstack_deployment.errors[:overcloud_compute_flavor] << _('Openstack deployments must have a Compute flavor for the Overcloud')
        end

        if openstack_deployment.overcloud_compute_count.nil? || openstack_deployment.overcloud_compute_count < 1
          openstack_deployment.errors[:overcloud_compute_count] << _('Openstack deployments must have at least 1 Compute node for the Overcloud')
        end

        if openstack_deployment.overcloud_controller_flavor.empty?
          openstack_deployment.errors[:overcloud_controller_flavor] << _('Openstack deployments must have a Controller flavor for the Overcloud')
        end

        if openstack_deployment.overcloud_controller_count.nil? || openstack_deployment.overcloud_controller_count < 1
          openstack_deployment.errors[:overcloud_controller_count] << _('Openstack deployments must have at least 1 Controller node for the Overcloud')
        end

        if openstack_deployment.overcloud_ceph_storage_flavor.empty?
          openstack_deployment.errors[:overcloud_ceph_storage_flavor] << _('Openstack deployments must have a Ceph Storage flavor for the Overcloud')
        end

        if openstack_deployment.overcloud_ceph_storage_count.nil?
          openstack_deployment.errors[:overcloud_ceph_storage_count] << _('Openstack deployments must specify Ceph Storage node count for the Overcloud')
        end

        if openstack_deployment.overcloud_block_storage_flavor.empty?
          openstack_deployment.errors[:overcloud_block_storage_flavor] << _('Openstack deployments must have a Block Storage flavor for the Overcloud')
        end

        if openstack_deployment.overcloud_block_storage_count.nil?
          openstack_deployment.errors[:overcloud_block_storage_count] << _('Openstack deployments must specify Block Storage node count for the Overcloud')
        end

        if openstack_deployment.overcloud_object_storage_flavor.empty?
          openstack_deployment.errors[:overcloud_object_storage_flavor] << _('Openstack deployments must have a Object Storage flavor for the Overcloud')
        end

        if openstack_deployment.overcloud_object_storage_count.nil?
          openstack_deployment.errors[:overcloud_object_storage_count] << _('Openstack deployments must specify Object Storage node count for the Overcloud')
        end
      end

      def validate_ceph(openstack_deployment)
        return unless openstack_deployment.external_ceph_storage

        if openstack_deployment.ceph_ext_mon_host.empty?
          openstack_deployment.errors[:ceph_ext_mon_host] << _('Openstack deployment is missing external host address for external Ceph Storage')
        end

        if openstack_deployment.ceph_cluster_fsid.empty?
          openstack_deployment.errors[:ceph_cluster_fsid] << _('Openstack deployment is missing cluster fsid for external Ceph Storage')
        end

        if openstack_deployment.ceph_client_username.empty?
          openstack_deployment.errors[:ceph_client_username] << _('Openstack deployment is missing client username for external Ceph Storage')
        end

        if openstack_deployment.ceph_client_key.empty?
          openstack_deployment.errors[:ceph_client_key] << _('Openstack deployment is missing client key for external Ceph Storage')
        end

        if openstack_deployment.nova_rbd_pool_name.empty?
          openstack_deployment.errors[:nova_rbd_pool_name] << _('Openstack deployment is missing the Nova RBD pool name for external Ceph Storage')
        end

        if openstack_deployment.cinder_rbd_pool_name.empty?
          openstack_deployment.errors[:cinder_rbd_pool_name] << _('Openstack deployment is missing the Cinder RBD pool name for external Ceph Storage')
        end

        if openstack_deployment.glance_rbd_pool_name.empty?
          openstack_deployment.errors[:glance_rbd_pool_name] << _('Openstack deployment is missing the Glance RBD pool name for external Ceph Storage')
        end
      end

      def validate_network(openstack_deployment)
        return unless openstack_deployment.deploy_cfme?

        float_sn = get_ip(openstack_deployment.overcloud_float_net)
        return unless float_sn

        conflict_found = Host.all.any? do |host|
          ip = get_ip(host.ip)
          ip && ip.is_in?(float_sn)
        end

        if conflict_found
          warning = "You already have hosts with addresses on the floating IP subnet #{float_sn} for this deployment. "\
                    "If you proceed and a VM is assigned a conflicting IP address by OpenStack your deployment will fail."
          add_warning(openstack_deployment, warning)
        end
      end

      def get_ip(ip_str)
        begin
          IP.new(ip_str)
        rescue ArgumentError
          nil
        end
      end

      def add_warning(openstack_deployment, warning, other_info = '')
        openstack_deployment.warnings << warning
        full_warning = other_info.blank? ? warning : "#{warning} #{other_info}"
        Rails.logger.warn("#{full_warning}")
      end
    end
  end
end
