class AddCephToOpenstackDeployments < ActiveRecord::Migration
  def change
    add_column :fusor_openstack_deployments, :external_ceph_storage, :boolean, default: false, null: false
    add_column :fusor_openstack_deployments, :ceph_ext_mon_host, :string
    add_column :fusor_openstack_deployments, :ceph_cluster_fsid, :string
    add_column :fusor_openstack_deployments, :ceph_client_username, :string
    add_column :fusor_openstack_deployments, :ceph_client_key, :string
    add_column :fusor_openstack_deployments, :nova_rbd_pool_name, :string, default: 'vms'
    add_column :fusor_openstack_deployments, :cinder_rbd_pool_name, :string, default: 'volumes'
    add_column :fusor_openstack_deployments, :glance_rbd_pool_name, :string, default: 'images'
  end
end
