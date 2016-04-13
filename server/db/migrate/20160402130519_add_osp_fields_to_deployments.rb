class AddOspFieldsToDeployments < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :openstack_overcloud_node_count, :integer

    add_column :fusor_deployments, :openstack_overcloud_ceph_storage_flavor, :string
    add_column :fusor_deployments, :openstack_overcloud_ceph_storage_count, :integer

    add_column :fusor_deployments, :openstack_overcloud_cinder_storage_flavor, :string
    add_column :fusor_deployments, :openstack_overcloud_cinder_storage_count, :integer

    add_column :fusor_deployments, :openstack_overcloud_swift_storage_flavor, :string
    add_column :fusor_deployments, :openstack_overcloud_swift_storage_count, :integer

    add_column :fusor_deployments, :openstack_overcloud_compute_flavor, :string
    add_column :fusor_deployments, :openstack_overcloud_compute_count, :integer

    add_column :fusor_deployments, :openstack_overcloud_controller_flavor, :string
    add_column :fusor_deployments, :openstack_overcloud_controller_count, :integer

    add_column :fusor_deployments, :openstack_overcloud_ext_net_interface, :string, default: 'nic2'
    add_column :fusor_deployments, :openstack_overcloud_libvirt_type, :string, default: 'kvm'
  end
end
