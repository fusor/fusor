class AllowNullLifecycleEnvironmentForDeployment < ActiveRecord::Migration
  def up
    change_column :fusor_deployments, :lifecycle_environment_id, :integer, :null => true
  end

  def down
    change_column :fusor_deployments, :lifecycle_environment_id, :integer, :null => false
  end
end
