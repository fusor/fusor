class AddDeployOpenshift < ActiveRecord::Migration
  def change

    add_column :fusor_deployments, :deploy_openshift, :boolean, :default => false
    add_column :fusor_deployments, :openshift_install_loc, :string
    add_column :fusor_deployments, :openshift_storage_size, :integer, :default => 0
    add_column :fusor_deployments, :openshift_username, :string

  end
end
