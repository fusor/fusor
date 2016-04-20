class AddOpenshiftRootPassword < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :openshift_root_password, :string
  end
end
