class AddSshKeyFields < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :ssh_public_key, :text
    add_column :fusor_deployments, :ssh_private_key, :text
  end
end
