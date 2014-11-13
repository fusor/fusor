class AddDeployment < ActiveRecord::Migration

  def change
    create_table 'fusor_deployments' do |t|
      t.string 'name', null: false
    end
  end

end
