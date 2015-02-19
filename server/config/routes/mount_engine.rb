Foreman::Application.routes.draw do
  mount Fusor::Engine, :at => '/fusor', :as => 'fusor'
end
