class AddOpenstackOvercloudNetworks < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :openstack_overcloud_private_net, :string
    add_column :fusor_deployments, :openstack_overcloud_float_net, :string
  end
end
