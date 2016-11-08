Fusor::Engine.routes.draw do
  scope :fusor, :path => '/fusor' do
    namespace :api do
      scope :openstack, :module => :openstack, :path => :openstack do
        resources :deployments do
          resources :deployment_plans, :param => :name, :only => [:show, :update] do
            member do
              post 'deploy', to: 'deployment_plans#deploy'
              put 'update_parameters', to: 'deployment_plans#update_parameters'
              put 'update_role_count', to: 'deployment_plans#update_role_count'
              put 'update_role_flavor', to: 'deployment_plans#update_role_flavor'
            end
          end

          resources :flavors, :only => [:index, :show]

          resources :images, :only => :index
          get '/images/show_by_name/:name', to: 'images#show_by_name', as: 'images_show_by_name'

          resources :nodes, :only => [:index, :show, :create, :destroy]
          get '/node_ports', to: 'nodes#list_ports'
          post '/node_mac_addresses', to: 'nodes#discover_macs' #POST so we don't expose password param

          resources :stacks, :param => :name, :only => [:index, :show, :destroy]

          get '/undercloud', to: 'underclouds#show'
          post '/undercloud', to: 'underclouds#create'
          post '/undercloud/update_dns', to: 'underclouds#update_dns'
        end
      end
    end
  end
end
