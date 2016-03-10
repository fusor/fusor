class AddHasContentError < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :has_content_error, :boolean
  end
end
