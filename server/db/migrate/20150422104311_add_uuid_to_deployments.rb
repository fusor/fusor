class AddUuidToDeployments < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :foreman_task_uuid, :string
  end
end
