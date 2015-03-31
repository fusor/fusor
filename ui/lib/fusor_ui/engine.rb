module FusorUi
  class Engine < ::Rails::Engine
    engine_name 'fusor_ui'

    initializer "static assets" do |app|
      app.middleware.insert_before(::ActionDispatch::Static, ::ActionDispatch::Static, "#{config.root}/public")
    end

    initializer 'fusor_ui.register_plugin', :after=> :finisher_hook do |app|
      Foreman::Plugin.register :fusor_ui do
        requires_foreman '>= 1.4'

        security_block :fusor do
          permission :view_fusor_deployments, {
            :placeholders => [:index, :new, :r]
          }
        end

        sub_menu :top_menu, :fusor_menu, :caption => N_('RHCI Installer'), :after => :infrastructure_menu do
          menu :top_menu, :fusor_deployments,
               :url_hash => { :controller => 'fusor_ui/placeholders', :action => :index },
               :caption  => N_('Deployments')
          menu :top_menu, :new_fusor_deployment,
               :url_hash => { :controller => 'fusor_ui/placeholders', :action => :new },
               :caption  => N_('New Deployment')
        end

      end
    end

    initializer "fusor_ui.plugin", :group => :all do |app|
      SETTINGS[:fusor_ui] = {:assets => {}} if SETTINGS[:fusor_ui].nil?

      SETTINGS[:fusor_ui][:assets][:precompile] = [
        'fusor_ui/fusor-ember-cli.css',
        'fusor_ui/fusor-ember-cli.js',
        'fusor_ui/vendor.js'
      ]
    end

  end
end
