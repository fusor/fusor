class AddRhevParams < ActiveRecord::Migration
  def change
    remove_column :fusor_deployments, :rhev_params
    add_column :fusor_deployments, :rhev_hypervisor_host_id, :integer
    add_column :fusor_deployments, :rhev_engine_host_id, :integer
    add_column :fusor_deployments, :rhev_hypervisor, :string
    add_column :fusor_deployments, :rhev_engine, :string
    add_column :fusor_deployments, :rhev_database, :string
    add_column :fusor_deployments, :rhev_cluster, :string
    add_column :fusor_deployments, :rhev_storage, :string
    add_column :fusor_deployments, :rhev_cpu, :string
    add_column :fusor_deployments, :rhev_share, :string
  end
end
