class AddOpenshiftSubdomain < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :openshift_subdomain_name, :string
  end
end
