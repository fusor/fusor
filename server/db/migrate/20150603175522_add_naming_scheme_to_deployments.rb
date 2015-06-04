class AddNamingSchemeToDeployments < ActiveRecord::Migration
  def change
    add_column :fusor_deployments, :host_naming_scheme, :string
    add_column :fusor_deployments, :custom_preprend_name, :string
    add_column :fusor_deployments, :enable_access_insights, :boolean
  end
end
