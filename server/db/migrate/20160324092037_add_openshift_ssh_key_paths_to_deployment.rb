class AddOpenshiftSshKeyPathsToDeployment < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :ose_public_key_path, :string
    add_column :fusor_deployments, :ose_private_key_path, :string
  end
end
