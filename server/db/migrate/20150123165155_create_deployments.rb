class CreateDeployments < ActiveRecord::Migration
  def change
    create_table :fusor_deployments do |t|
      t.string :name
      t.integer :lifecycle_environment_id
      t.integer :organization_id
      t.boolean :deploy_rhev, :default => false
      t.boolean :deploy_cfme, :default => false
      t.boolean :deploy_openstack, :default => false
      t.integer :rhev_hypervisor_host_id
      t.integer :rhev_engine_host_id
      t.string :rhev_hypervisor_hostname
      t.string :rhev_engine_hostname
      t.string :rhev_database_name
      t.string :rhev_cluster_name
      t.string :rhev_storage_name
      t.string :rhev_storage_type
      t.string :rhev_storage_address
      t.string :rhev_cpu_type
      t.string :rhev_share_path
      t.string :cfme_install_loc

      t.timestamps
    end
  end
end
