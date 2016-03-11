class AddCfmeFields < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :cloudforms_vcpu, :integer, :default => 0
    add_column :fusor_deployments, :cloudforms_ram, :integer, :default => 0
    add_column :fusor_deployments, :cloudforms_vm_disk_size, :integer, :default => 0
    add_column :fusor_deployments, :cloudforms_db_disk_size, :integer, :default => 0
  end
end
