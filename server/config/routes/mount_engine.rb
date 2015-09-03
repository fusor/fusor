Foreman::Application.routes.draw do
  mount Fusor::Engine, :at => '/', :as => 'fusor'
end
