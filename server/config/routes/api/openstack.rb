Fusor::Engine.routes.draw do
  scope :fusor, :path => '/fusor' do
    namespace :api do
      scope :openstack, :module => :openstack, :path => :openstack do
        resources :deployment_plans
        resources :deployment_roles
        resources :flavors
        resources :images
        get '/images/show_by_name/:name', to: 'images#show_by_name', as: 'images_show_by_name'
        resources :nodes
      end
    end
  end
end
