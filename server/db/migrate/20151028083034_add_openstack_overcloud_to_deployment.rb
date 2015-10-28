class AddOpenstackOvercloudToDeployment < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :openstack_overcloud_address, :string
    add_column :fusor_deployments, :openstack_overcloud_password, :string
  end
end
