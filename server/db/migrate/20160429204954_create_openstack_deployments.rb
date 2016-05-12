class CreateOpenstackDeployments < ActiveRecord::Migration
  def up
    create_table :fusor_openstack_deployments do |t|
      t.string :undercloud_admin_password   # originally fusor_deployments.openstack_undercloud_password
      t.string :undercloud_ip_address       # originally fusor_deployments.openstack_undercloud_ip_addr
      t.string :undercloud_ssh_username     # originally fusor_deployments.openstack_undercloud_user
      t.string :undercloud_ssh_password     # originally fusor_deployments.openstack_undercloud_user_password

      t.string :overcloud_address
      t.string :overcloud_ext_net_interface, default: 'nic2'
      t.string :overcloud_private_net
      t.string :overcloud_float_net
      t.string :overcloud_float_gateway
      t.string :overcloud_password
      t.string :overcloud_libvirt_type, default: 'kvm'

      t.integer :overcloud_node_count, default: 0
      t.string :overcloud_compute_flavor, default: 'baremetal'
      t.integer :overcloud_compute_count, default: 0
      t.string :overcloud_controller_flavor, default: 'baremetal'
      t.integer :overcloud_controller_count, default: 0
      t.string :overcloud_ceph_storage_flavor, default: 'baremetal'
      t.integer :overcloud_ceph_storage_count, default: 0
      t.string :overcloud_block_storage_flavor, default: 'baremetal'
      t.integer :overcloud_block_storage_count, default: 0
      t.string :overcloud_object_storage_flavor, default: 'baremetal'
      t.integer :overcloud_object_storage_count, default: 0

      t.string :overcloud_hostname
      t.string :undercloud_hostname

      t.timestamps
    end

    change_table :fusor_deployments do |t|
      t.remove :openstack_undercloud_password
      t.remove :openstack_undercloud_ip_addr
      t.remove :openstack_undercloud_user
      t.remove :openstack_undercloud_user_password
      t.remove :openstack_overcloud_address
      t.remove :openstack_overcloud_password
      t.remove :openstack_overcloud_private_net
      t.remove :openstack_overcloud_float_net
      t.remove :openstack_overcloud_float_gateway
      t.remove :openstack_overcloud_hostname
      t.remove :openstack_undercloud_hostname
      t.remove :openstack_overcloud_compute_flavor
      t.remove :openstack_overcloud_compute_count
      t.remove :openstack_overcloud_controller_flavor
      t.remove :openstack_overcloud_controller_count
      t.remove :openstack_overcloud_ext_net_interface
      t.remove :openstack_overcloud_libvirt_type
      t.remove :openstack_overcloud_node_count
      t.remove :openstack_overcloud_ceph_storage_flavor
      t.remove :openstack_overcloud_ceph_storage_count
      t.remove :openstack_overcloud_cinder_storage_flavor
      t.remove :openstack_overcloud_cinder_storage_count
      t.remove :openstack_overcloud_swift_storage_flavor
      t.remove :openstack_overcloud_swift_storage_count

      t.references :openstack_deployment
      t.index :openstack_deployment_id
    end
  end

  def down
    change_table :fusor_deployments do |t|
      t.string :openstack_undercloud_password
      t.string :openstack_undercloud_ip_addr
      t.string :openstack_undercloud_user
      t.string :openstack_undercloud_user_password
      t.string :openstack_overcloud_address
      t.string :openstack_overcloud_password
      t.string :openstack_overcloud_private_net
      t.string :openstack_overcloud_float_net
      t.string :openstack_overcloud_float_gateway
      t.string :openstack_overcloud_hostname
      t.string :openstack_undercloud_hostname
      t.string :openstack_overcloud_compute_flavor
      t.integer :openstack_overcloud_compute_count
      t.string :openstack_overcloud_controller_flavor
      t.integer :openstack_overcloud_controller_count
      t.string :openstack_overcloud_ext_net_interface, default: 'nic2'
      t.string :openstack_overcloud_libvirt_type, default: 'kvm'
      t.integer :openstack_overcloud_node_count
      t.string :openstack_overcloud_ceph_storage_flavor
      t.integer :openstack_overcloud_ceph_storage_count
      t.string :openstack_overcloud_cinder_storage_flavor
      t.integer :openstack_overcloud_cinder_storage_count
      t.string :openstack_overcloud_swift_storage_flavor
      t.integer :openstack_overcloud_swift_storage_count

      t.remove :openstack_deployment_id
    end

    drop_table :fusor_openstack_deployments
  end
end
