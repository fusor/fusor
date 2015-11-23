class AddOpenstackOvercloudFloatGateway < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :openstack_overcloud_float_gateway, :string
  end
end
