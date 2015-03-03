class AddDescriptionToDeployments < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :description, :string
  end
end
