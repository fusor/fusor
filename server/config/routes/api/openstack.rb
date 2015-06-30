Fusor::Engine.routes.draw do
  scope :fusor, :path => '/fusor' do
    namespace :api do
      scope :openstack, :module => :openstack, :path => :openstack do
        resources :deployment_plans
        put '/deployment_plans/:id/update_role_count', to: 'deployment_plans#update_role_count', as: 'deployment_plans_update_role_count'
        put '/deployment_plans/:id/update_role_flavor', to: 'deployment_plans#update_role_flavor', as: 'deployment_plans_update_role_flavor'
        resources :deployment_roles
        resources :flavors
        resources :images
        get '/images/show_by_name/:name', to: 'images#show_by_name', as: 'images_show_by_name'
        resources :nodes
      end
    end
  end
end
