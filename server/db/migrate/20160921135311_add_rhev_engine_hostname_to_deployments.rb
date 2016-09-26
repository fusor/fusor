class AddRhevEngineHostnameToDeployments < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :rhev_self_hosted_engine_hostname, :string
  end
end
