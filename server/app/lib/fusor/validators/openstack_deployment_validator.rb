module Fusor
  module Validators
    class OpenstackDeploymentValidator < ActiveModel::Validator

      def validate(openstack_deployment)
        if openstack_deployment.undercloud_admin_password.empty?
          openstack_deployment.errors[:undercloud_password] << _('Openstack deployments must specify an admin password for the Undercloud')
        end

        if openstack_deployment.undercloud_ip_address.empty?
          openstack_deployment.errors[:undercloud_ip_addr] << _('Openstack deployments must specify an ip address for the Undercloud')
        end

        if openstack_deployment.undercloud_ssh_username.empty?
          openstack_deployment.errors[:undercloud_user] << _('Openstack deployments must specify an ssh user for the Undercloud')
        end

        if openstack_deployment.undercloud_ssh_password.empty?
          openstack_deployment.errors[:undercloud_user_password] << _('Openstack deployments must specify an ssh password for the Undercloud')
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
          openstack_deployment.errors[:overcloud_password] << _('Openstack deployments must specify a floating network for the Overcloud')
        end

        if openstack_deployment.overcloud_float_gateway.empty?
          openstack_deployment.errors[:overcloud_float_gateway] << _('Openstack deployments must specify a floating network gateway for the Overcloud')
        end

        if openstack_deployment.overcloud_compute_flavor.empty?
          openstack_deployment.errors[:overcloud_compute_flavor] << _('Openstack deployments must have a Compute flavor for the Overcloud')
        end

        if openstack_deployment.overcloud_compute_count.nil? || openstack_deployment.overcloud_compute_count < 1
          openstack_deployment.errors[:overcloud_compute_flavor] << _('Openstack deployments must have at least 1 Compute node for the Overcloud')
        end

        if openstack_deployment.overcloud_controller_flavor.empty?
          openstack_deployment.errors[:overcloud_controller_flavor] << _('Openstack deployments must have a Controller flavor for the Overcloud')
        end

        if openstack_deployment.overcloud_controller_count.nil? || openstack_deployment.overcloud_controller_count < 1
          openstack_deployment.errors[:overcloud_compute_flavor] << _('Openstack deployments must have at least 1 Controller node for the Overcloud')
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
    end
  end
end
