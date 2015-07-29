class AddCfmeAddressToDeployment < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :cfme_address, :string
  end
end
