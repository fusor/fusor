class AddSubscriptions < ActiveRecord::Migration
  def change
    create_table :fusor_subscriptions do |t|
      t.integer :deployment_id
      t.string :contract_number
      t.string :product_name
      t.integer :quantity_attached

      t.timestamps
    end
  end

end
