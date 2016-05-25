class AddOvercloudDeployedToOpenstackDeployment < ActiveRecord::Migration
  def change
    add_column :fusor_openstack_deployments, :overcloud_deployed, :boolean
  end
end
