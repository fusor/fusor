class AddManifestColumnsToSubscriptions < ActiveRecord::Migration
  def change
    add_column :fusor_subscriptions, :start_date, :timestamp
    add_column :fusor_subscriptions, :end_date, :timestamp
    add_column :fusor_subscriptions, :total_quantity, :integer
    add_column :fusor_subscriptions, :source, :string, :length => 32, :null => false, :default => "imported"
  end
end
