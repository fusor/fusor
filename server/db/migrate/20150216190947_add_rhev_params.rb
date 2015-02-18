class AddRhevParams < ActiveRecord::Migration
  def change
    remove_column :fusor_deployments, :rhev_params
    add_column :fusor_deployments, :rhev_hypervisor_host_id, :integer
    add_column :fusor_deployments, :rhev_engine_host_id, :integer
    add_column :fusor_deployments, :rhev_hypervisor_hostname, :string
    add_column :fusor_deployments, :rhev_engine_hostname, :string
    add_column :fusor_deployments, :rhev_database_name, :string
    add_column :fusor_deployments, :rhev_cluster_name, :string
    add_column :fusor_deployments, :rhev_storage_name, :string
    add_column :fusor_deployments, :rhev_storage_type, :string
    add_column :fusor_deployments, :rhev_storage_address, :string
    add_column :fusor_deployments, :rhev_cpu_type, :string
    add_column :fusor_deployments, :rhev_share_path, :string
  end
end
