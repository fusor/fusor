Fusor::Engine.routes.draw do
  scope :fusor, :path => '/fusor' do
    namespace :api do
      scope :openstack, :module => :openstack, :path => :openstack do
        resources :deployment_plans
        post '/deployment_plans/:id/deploy', to: 'deployment_plans#deploy', as: 'deployment_plans_deploy'
        put '/deployment_plans/:id/update_parameters', to: 'deployment_plans#update_parameters', as: 'deployment_plans_update_parameters'
        put '/deployment_plans/:id/update_role_count', to: 'deployment_plans#update_role_count', as: 'deployment_plans_update_role_count'
        put '/deployment_plans/:id/update_role_flavor', to: 'deployment_plans#update_role_flavor', as: 'deployment_plans_update_role_flavor'
        resources :deployment_roles
        resources :flavors
        resources :images
        get '/images/show_by_name/:name', to: 'images#show_by_name', as: 'images_show_by_name'
        resources :nodes
        get '/nodes/:id/ready', to: 'nodes#ready', as: 'nodes_ready'
        resources :openstack_deployments
        resources :underclouds
      end
    end
  end
end
