class CreateDeployments < ActiveRecord::Migration
  def change
    create_table :fusor_deployments do |t|
      t.string :name
      t.integer :lifecycle_environment_id
      t.integer :organization_id
      t.text :rhev_params
      t.text :cfme_params
      t.text :openstack_params

      t.timestamps
    end
  end
end
