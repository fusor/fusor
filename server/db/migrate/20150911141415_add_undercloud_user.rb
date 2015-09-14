class AddUndercloudUser < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :openstack_undercloud_user, :string
    add_column :fusor_deployments, :openstack_undercloud_user_password, :string
  end
end
