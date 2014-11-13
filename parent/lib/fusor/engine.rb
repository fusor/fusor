require 'deface'

module Fusor
  class Engine < ::Rails::Engine

    config.autoload_paths += Dir["#{config.root}/app/controllers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/helpers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/models/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/overrides"]

    # Add any db migrations
    initializer "fusor.load_app_instance_data" do |app|
      app.config.paths['db/migrate'] += Fusor::Engine.paths['db/migrate'].existent
    end

    initializer 'fusor.register_plugin', :after => :finisher_hook do |app|
      Foreman::Plugin.register :fusor do
        requires_foreman '>= 1.8'

        # Add permissions
        # security_block :fusor do
        #   permission :view_fusor, { :'fusor/hosts' => [:new_action] }
        # end

        # Add a new role called 'Discovery' if it doesn't exist
        # role "Fusor", [:view_fusor]

      end
    end

    initializer "fusor.apipie" do
      Apipie.configuration.api_controllers_matcher << "#{Fusor::Engine.root}/app/controllers/fusor/api/v2/*.rb"
      Apipie.configuration.checksum_path += ['/fusor/api/']
    end

    #Include concerns in this config.to_prepare block
    config.to_prepare do
      # include concerns
    end

    rake_tasks do
      Rake::Task['db:seed'].enhance do
        Fusor::Engine.load_seed
      end
    end

  end
end
