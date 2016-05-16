class AddCfmeDbPasswordToDeployment < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :cfme_db_password, :string
  end
end
