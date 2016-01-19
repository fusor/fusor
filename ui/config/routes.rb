Rails.application.routes.draw do

  get 'r/deployments', :to => 'fusor_ui/placeholders#index'
  get 'r/deployments/new/start', :to => 'fusor_ui/placeholders#new', :as => :new_fusor_deployment
  get 'r/#/deployments', :to => 'fusor_ui/placeholders#index_with_hash', :as => :index_with_hash_fusor_deployment
  get 'r/#/deployments/new/start', :to => 'fusor_ui/placeholders#new_with_hash', :as => :new_with_hash_fusor_deployment
  get 'r', :to => 'fusor_ui/placeholders#r'

end
