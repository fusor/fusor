class AddOpenStackAttributesToDeployments < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :undercloud_deployed, :boolean, :default => false
    add_column :fusor_deployments, :undercloud_failed,   :boolean, :default => false
  end
end
