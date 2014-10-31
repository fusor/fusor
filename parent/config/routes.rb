Rails.application.routes.draw do

  match 'new_action', :to => 'welder/hosts#new_action'

end
