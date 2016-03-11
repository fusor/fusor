class AddOpenshiftFields < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :openshift_master_vcpu, :integer, :default => 0
    add_column :fusor_deployments, :openshift_master_ram, :integer, :default => 0
    add_column :fusor_deployments, :openshift_master_disk, :integer, :default => 0

    add_column :fusor_deployments, :openshift_node_vcpu, :integer, :default => 0
    add_column :fusor_deployments, :openshift_node_ram, :integer, :default => 0
    add_column :fusor_deployments, :openshift_node_disk, :integer, :default => 0

    add_column :fusor_deployments, :openshift_available_vcpu, :integer, :default => 0
    add_column :fusor_deployments, :openshift_available_ram, :integer, :default => 0
    add_column :fusor_deployments, :openshift_available_disk, :integer, :default => 0

    add_column :fusor_deployments, :openshift_number_master_nodes, :integer, :default => 0
    add_column :fusor_deployments, :openshift_number_worker_nodes, :integer, :default => 0

    add_column :fusor_deployments, :openshift_storage_type, :string
    add_column :fusor_deployments, :openshift_storage_name, :string
    add_column :fusor_deployments, :openshift_storage_desc, :string
    add_column :fusor_deployments, :openshift_export_path, :string
  end
end
