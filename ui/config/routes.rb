Rails.application.routes.draw do

  get 'r#/deployments', :to => 'fusor_ui/deployments#index'
  get 'r', :to => 'fusor_ui/deployments#new'

end
