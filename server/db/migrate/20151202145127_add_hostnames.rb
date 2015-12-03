class AddHostnames < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :openstack_overcloud_hostname, :string
    add_column :fusor_deployments, :openstack_undercloud_hostname, :string
    add_column :fusor_deployments, :cfme_hostname, :string
  end
end
