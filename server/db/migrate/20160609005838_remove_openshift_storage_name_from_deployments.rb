class RemoveOpenshiftStorageNameFromDeployments < ActiveRecord::Migration
  def up
    remove_column :fusor_deployments, :openshift_storage_name
  end

  def down
    add_column :fusor_deployments, :openshift_storage_name, :string
  end
end
