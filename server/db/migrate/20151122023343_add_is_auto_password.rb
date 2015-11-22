class AddIsAutoPassword < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :openstack_overcloud_autogenerate_password, :boolean
  end
end
