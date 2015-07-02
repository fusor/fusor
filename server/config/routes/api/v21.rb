Fusor::Engine.routes.draw do
  scope :fusor, :path => '/fusor' do
    namespace :api do
      scope "(:api_version)", :module => :v21, :defaults => {:api_version => 'v21'}, :api_version => /v21/, :constraints => ApiConstraints.new(:version => 21, :default => false) do
        resources :deployments do
          member do
            put :deploy
          end
        end
        resources :subscriptions
      end
    end
  end
end
