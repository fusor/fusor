class RemoveGlusterColumns < ActiveRecord::Migration
  def up
    remove_column :fusor_deployments, :rhev_gluster_node_name
    remove_column :fusor_deployments, :rhev_gluster_node_address
    remove_column :fusor_deployments, :rhev_gluster_ssh_port
    remove_column :fusor_deployments, :rhev_gluster_root_password
  end

  def down
    add_column :fusor_deployments, :rhev_gluster_node_name, :string
    add_column :fusor_deployments, :rhev_gluster_node_address, :string
    add_column :fusor_deployments, :rhev_gluster_ssh_port, :string
    add_column :fusor_deployments, :rhev_gluster_root_password, :string
  end
end
