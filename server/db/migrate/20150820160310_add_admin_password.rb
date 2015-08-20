class AddAdminPassword < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :cfme_admin_password, :string
  end
end
