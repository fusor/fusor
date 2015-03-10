class RemoveHypervisorFromDeployments < ActiveRecord::Migration
  def up
    remove_column :fusor_deployments, :rhev_hypervisor_hostname
    remove_column :fusor_deployments, :rhev_hypervisor_host_id
    add_column :fusor_deployments, :rhev_is_self_hosted, :boolean, :default => false
  end

  def down
    add_column :fusor_deployments, :rhev_hypervisor_hostname, :string
    add_column :fusor_deployments, :rhev_hypervisor_host_id, :string
    remove_column :fusor_deployments, :rhev_is_self_hosted
  end
end
