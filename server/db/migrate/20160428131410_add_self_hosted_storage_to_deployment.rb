class AddSelfHostedStorageToDeployment < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :hosted_storage_name, :string
    add_column :fusor_deployments, :hosted_storage_type, :string
    add_column :fusor_deployments, :hosted_storage_address, :string
    add_column :fusor_deployments, :hosted_storage_path, :string
  end
end
