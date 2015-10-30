class AddIsDisconnected < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :is_disconnected, :boolean
  end
end
