class AddLabelToDeployments < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :label, :string
  end
end
