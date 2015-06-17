Fusor::Engine.routes.draw do
  scope :fusor, :path => '/fusor' do
    namespace :api do
      scope :openstack, :module => :openstack, :path => :openstack do
        resources :deployment_roles
        resources :flavors
        resources :nodes
      end
    end
  end
end
