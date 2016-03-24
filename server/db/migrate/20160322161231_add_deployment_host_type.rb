class AddDeploymentHostType < ActiveRecord::Migration
  def change
    add_column :fusor_deployment_hosts, :deployment_host_type, :string, :null => false, :default => "rhev_hypervisor"
  end
end
