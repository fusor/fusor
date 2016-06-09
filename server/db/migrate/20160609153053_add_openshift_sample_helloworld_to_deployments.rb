class AddOpenshiftSampleHelloworldToDeployments < ActiveRecord::Migration
  def up
    add_column :fusor_deployments, :openshift_sample_helloworld, :boolean, default: false, null: false
  end

  def down
    remove_column :fusor_deployments, :openshift_sample_helloworld
  end
end
