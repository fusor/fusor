class AddCfmeMultiregionFieldsToDeployment < ActiveRecord::Migration
  def up
    add_column :fusor_deployments, :cfme_rhv_address, :string
    add_column :fusor_deployments, :cfme_rhv_hostname, :string
    add_column :fusor_deployments, :cfme_osp_address, :string
    add_column :fusor_deployments, :cfme_osp_hostname, :string
    ::Fusor::Deployment.find_each do |deployment|
      if deployment.cfme_install_loc == 'RHEV'
        deployment.update_attribute(:cfme_rhv_address, deployment.cfme_address)
        deployment.update_attribute(:cfme_rhv_hostname, deployment.cfme_hostname)
      else
        deployment.update_attribute(:cfme_osp_address, deployment.cfme_address)
        deployment.update_attribute(:cfme_osp_hostname, deployment.cfme_hostname)
      end
    end
    remove_column :fusor_deployments, :cfme_address
    remove_column :fusor_deployments, :cfme_hostname
  end

  def down
    add_column :fusor_deployments, :cfme_address, :string
    add_column :fusor_deployments, :cfme_hostname, :string
    ::Fusor::Deployment.find_each do |deployment|
      if deployment.cfme_install_loc == 'RHEV'
        deployment.update_attribute(:cfme_address, deployment.cfme_rhv_address)
        deployment.update_attribute(:cfme_hostname, deployment.cfme_rhv_hostname)
      else
        deployment.update_attribute(:cfme_address, deployment.cfme_osp_address)
        deployment.update_attribute(:cfme_hostname, deployment.cfme_osp_hostname)
      end
    end
    remove_column :fusor_deployments, :cfme_rhv_address
    remove_column :fusor_deployments, :cfme_rhv_hostname
    remove_column :fusor_deployments, :cfme_osp_address
    remove_column :fusor_deployments, :cfme_osp_hostname
  end
end
