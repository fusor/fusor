class AddRootPasswordsToDeployments < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :rhev_root_password, :string
    add_column :fusor_deployments, :cfme_root_password, :string
  end
end
