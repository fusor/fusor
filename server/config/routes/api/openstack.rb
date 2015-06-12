Fusor::Engine.routes.draw do
  scope :fusor, :path => '/fusor' do
    namespace :api do
      scope :openstack, :module => :openstack, :path => :openstack do
        resources :flavors
      end
    end
  end
end
