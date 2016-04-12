class RenameRhevDataCenterName < ActiveRecord::Migration
  def change
    rename_column :fusor_deployments, :rhev_database_name, :rhev_data_center_name
  end
end
