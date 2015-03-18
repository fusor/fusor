class AddDeploymentHosts < ActiveRecord::Migration
  def change
    create_table :fusor_deployment_hosts do |t|
      t.integer :deployment_id,                      :null => false
      t.integer :host_id, :null => false

      t.timestamps
    end
  end
end
