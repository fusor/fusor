module FusorUi
  class Engine < ::Rails::Engine

    initializer "static assets" do |app|
      app.middleware.insert_before(::ActionDispatch::Static, ::ActionDispatch::Static, "#{config.root}/public")
    end

    initializer 'fusor_ui.register_plugin', :after=> :finisher_hook do |app|
      Foreman::Plugin.register :fusor do
        requires_foreman '>= 1.4'

        # Add permissions (TODO - do we need to set permissions here)
        # security_block :fusor do
        #   permission :view_fusor, {:'fusor/deployments' => [:r] }
        # end

        # Add role (TODO - will there be a rails called view_fusor)
        # role "FusorUi", [:view_fusor]

        sub_menu :top_menu, :fusor_menu, :caption => N_('Fusor Installer'), :after => :infrastructure_menu do
          menu :top_menu, :fusor_deployments,
               :url_hash => { :controller => 'fusor_ui/deployments', :action => :index },
               :caption  => N_('Deployments')
          menu :top_menu, :new_fusor_deployment,
               :url_hash => { :controller => 'fusor_ui/deployments', :action => :new },
               :caption  => N_('New Deployment')
        end

      end
    end

  end
end
