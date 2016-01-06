class AddQuantityToAdd < ActiveRecord::Migration
  def change

    add_column :fusor_subscriptions, :quantity_to_add, :integer, :default => 0

  end
end
