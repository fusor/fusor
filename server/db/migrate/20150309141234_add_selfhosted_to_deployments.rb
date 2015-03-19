class AddSelfhostedToDeployments < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :rhev_is_self_hosted, :boolean, :default => false
    add_column :fusor_deployments, :rhev_engine_admin_password, :string
  end
end
