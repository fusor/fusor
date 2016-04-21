class RemoveOseStorageDescAddOseStorageHost < ActiveRecord::Migration
  def up
    remove_column :fusor_deployments, :openshift_storage_desc
    add_column :fusor_deployments, :openshift_storage_host, :string
  end

  def down
    add_column :fusor_deployments, :openshift_storage_desc, :string
    remove_column :fusor_deployments, :openshift_storage_host
  end
end
