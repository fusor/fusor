Fusor::Engine.routes.draw do
  scope :fusor, :path => '/fusor' do
    namespace :api do
      scope "(:api_version)", :module => :v2, :defaults => {:api_version => 'v2'}, :api_version => /v2/, :constraints => ApiConstraints.new(:version => 2, :default => true) do
        resources :deployments do
          member do
            put :deploy
          end
        end
      end
    end
  end
end
