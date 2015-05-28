class AddConsumerNameToDeployment < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :upstream_consumer_name, :string
  end
end
