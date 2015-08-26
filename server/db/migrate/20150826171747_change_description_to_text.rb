class ChangeDescriptionToText < ActiveRecord::Migration
  def change
    change_column :fusor_deployments, :description, :text
  end
end
