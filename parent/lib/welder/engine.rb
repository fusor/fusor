require 'deface'

module Welder
  class Engine < ::Rails::Engine

    config.autoload_paths += Dir["#{config.root}/app/controllers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/helpers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/models/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/overrides"]

    # Add any db migrations
    initializer "welder.load_app_instance_data" do |app|
      app.config.paths['db/migrate'] += Welder::Engine.paths['db/migrate'].existent
    end

    initializer 'welder.register_plugin', :after => :finisher_hook do |app|
      Foreman::Plugin.register :welder do
        requires_foreman '>= 1.4'

        # Add permissions
        security_block :welder do
          permission :view_welder, { :'welder/hosts' => [:new_action] }
        end

        # Add a new role called 'Discovery' if it doesn't exist
        role "Welder", [:view_welder]

        #add menu entry
        menu :top_menu, :template,
             :url_hash => { :controller => :'welder/hosts', :action => :new_action },
             :caption  => 'Welder',
             :parent   => :hosts_menu,
             :after    => :hosts

        # add dashboard widget
        widget 'welder_widget', :name => N_('Foreman plugin template widget'), :sizex => 4, :sizey => 1
      end
    end

    #Include concerns in this config.to_prepare block
    config.to_prepare do
      begin
        Host::Managed.send(:include, Welder::HostExtensions)
        HostsHelper.send(:include, Welder::HostsHelperExtensions)
      rescue => e
        puts "Welder: skipping engine hook (#{e.to_s})"
      end
    end

    rake_tasks do
      Rake::Task['db:seed'].enhance do
        Welder::Engine.load_seed
      end
    end

  end
end
