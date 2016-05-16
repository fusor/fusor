Fusor::Engine.routes.draw do
  scope :fusor, :path => '/fusor' do
    namespace :api do
      scope "(:api_version)", :module => :v3, :defaults => {:api_version => 'v3'}, :api_version => /v3/, :constraints => ApiConstraints.new(:version => 3, :default => false) do
        resources :deployments, :except => [:new, :edit] do
          member do
            put :deploy
            put :redeploy
            get :validate
            get :validate_cdn
            get :log
          end
        end

        resources :subscriptions, :except => [:new, :edit] do
          collection do
            put :upload
          end
        end

        resources :discovered_hosts, :except => [:new, :edit] do
          patch :rename, :on => :member
        end

        resources :organizations, :except => [:new, :edit]
        resources :lifecycle_environments, :except => [:new, :edit]

        resources :foreman_tasks, :except => [:new, :edit]

        scope 'unlogged' do
          get '/deployments/:id/log', to: 'deployments#log'
        end
      end
    end
  end
end
