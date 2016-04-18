class AddOpenshiftPassword < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :openshift_user_password, :string
  end
end
