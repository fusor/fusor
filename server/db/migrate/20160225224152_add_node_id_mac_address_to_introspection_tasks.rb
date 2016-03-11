class AddNodeIdMacAddressToIntrospectionTasks < ActiveRecord::Migration
  def change
    add_column :fusor_introspection_tasks, :node_uuid, :string
    add_column :fusor_introspection_tasks, :mac_address, :string
    add_column :fusor_introspection_tasks, :created_at, :timestamp
    add_column :fusor_introspection_tasks, :updated_at, :timestamp
  end
end
