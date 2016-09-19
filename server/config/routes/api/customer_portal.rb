Fusor::Engine.routes.draw do
  scope :module => :api do
    match '/customer_portal' => 'v2/root#resource_list', :via => :get

    scope :path => :customer_portal, :module => :customer_portal, :as => :customer_portal do
      match '/login' => 'customer_portal_proxies#login', :via => :post
      match '/logout' => 'customer_portal_proxies#logout', :via => :post
      match '/is_authenticated' => 'customer_portal_proxies#is_authenticated', :via => :get

      match '/users/:login/owners' => 'customer_portal_proxies#get', :via => :get, :as => :proxy_users_owners_path, :constraints => { :login => /\S+/ }
      match '/owners/:id/consumers' => 'customer_portal_proxies#get', :via => :get, :as => :proxy_owners_consumers_path
      match '/consumers' => 'customer_portal_proxies#post', :via => :post, :as => :proxy_consumer_create_path
      match '/consumers/:id' => 'customer_portal_proxies#get', :via => :get, :as => :proxy_consumer_show_path
      match '/pools' => 'customer_portal_proxies#get', :via => :get, :as => :proxy_pools_path
      match '/consumers/:id/entitlements' => 'customer_portal_proxies#get', :via => :get, :as => :proxy_consumer_entitlements_path
      match '/consumers/:id/entitlements' => 'customer_portal_proxies#post', :via => :post, :as => :proxy_consumer_entitlements_post_path
      match '/consumers/:id/entitlements' => 'customer_portal_proxies#delete', :via => :delete, :as => :proxy_consumer_entitlements_delete_path
      match '/consumers/:id/export' => 'customer_portal_proxies#export', :via => :get, :as => :proxy_consumer_export_path
    end
  end
end
