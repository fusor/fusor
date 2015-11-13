Fusor::Engine.routes.draw do
  scope :fusor, :path => '/fusor' do
    namespace :api do
      scope :openstack, :module => :openstack, :path => :openstack do
        resources :deployments do
          resources :deployment_plans, :only => [:show, :update] do
            member do
              post 'deploy', to: 'deployment_plans#deploy'
              put 'update_parameters', to: 'deployment_plans#update_parameters'
              put 'update_role_count', to: 'deployment_plans#update_role_count'
              put 'update_role_flavor', to: 'deployment_plans#update_role_flavor'
            end
          end

          resources :deployment_roles, :only => :index
          resources :flavors, :only => [:index, :show]

          resources :images, :only => :index
          get '/images/show_by_name/:name', to: 'images#show_by_name', as: 'images_show_by_name'

          resources :nodes, :only => [:index, :show, :create]

          resources :openstack_deployments, :only => [:index, :show]
          resources :underclouds, :only => [:show, :create]
        end
      end
    end
  end
end
