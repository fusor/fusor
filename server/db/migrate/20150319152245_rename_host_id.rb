class RenameHostId < ActiveRecord::Migration
  def change
    rename_column :fusor_deployment_hosts, :host_id, :discovered_host_id
  end
end
