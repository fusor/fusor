Rails.application.routes.draw do
  get 'r/*ember_route', :to => 'fusor_ui/placeholders#r'
  get 'r', :to => 'fusor_ui/placeholders#r'
end
