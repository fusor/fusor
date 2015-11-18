class AddOpenstackInterface < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :openstack_overcloud_interface, :string
  end
end
