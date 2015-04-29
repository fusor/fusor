class AddUpstreamConsumerUuidToDeployments < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :upstream_consumer_uuid, :string
  end
end
