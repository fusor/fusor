class AddUndercloudCredentials < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :openstack_undercloud_password, :string
    add_column :fusor_deployments, :openstack_undercloud_ip_addr, :string
  end
end
