Fusor::Engine.routes.draw do
  scope :fusor, :path => '/' do
    namespace :api do
      scope "(:api_version)", :module => :v21, :defaults => {:api_version => 'v21'}, :api_version => /v21/, :constraints => ApiConstraints.new(:version => 21, :default => false) do
        api_resources :deployments
      end
    end
  end
end
