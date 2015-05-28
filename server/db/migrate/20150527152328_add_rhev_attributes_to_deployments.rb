class AddRhevAttributesToDeployments < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :rhev_export_domain_name, :string
    add_column :fusor_deployments, :rhev_export_domain_address, :string
    add_column :fusor_deployments, :rhev_export_domain_path, :string
    add_column :fusor_deployments, :rhev_local_storage_path, :string
    add_column :fusor_deployments, :rhev_gluster_node_name, :string
    add_column :fusor_deployments, :rhev_gluster_node_address, :string
    add_column :fusor_deployments, :rhev_gluster_ssh_port, :string
    add_column :fusor_deployments, :rhev_gluster_root_password, :string
  end
end
