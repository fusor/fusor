class AddDisconnectedFieldsToDeployment < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :cdn_url, :string
    add_column :fusor_deployments, :manifest_file, :string
  end
end
