module Fusor
  class Engine < ::Rails::Engine
    isolate_namespace Fusor

    config.autoload_paths += Dir["#{config.root}/app/controllers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/helpers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/models/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/overrides"]
    config.autoload_paths += Dir["#{config.root}/app/serializers"]

    # Add any db migrations
    initializer "fusor.load_app_instance_data" do |app|
      app.config.paths['db/migrate'] += Fusor::Engine.paths['db/migrate'].existent
    end

    initializer 'fusor.mount_engine', :after => :build_middleware_stack do |app|
      app.routes_reloader.paths << "#{Fusor::Engine.root}/config/routes/mount_engine.rb"
    end

    initializer "fusor.paths" do |app|
      app.routes_reloader.paths << "#{Fusor::Engine.root}/config/routes/api/v2.rb"
      app.routes_reloader.paths << "#{Fusor::Engine.root}/config/routes/api/v21.rb"
      app.routes_reloader.paths << "#{Fusor::Engine.root}/config/routes/api/customer_portal.rb"
    end

    initializer 'fusor.register_plugin', :after => :finisher_hook do |app|
      Foreman::Plugin.register :fusor do
        requires_foreman '>= 1.7'

        security_block :fusor do
          permission :view_fusor_deployments, {
            :"fusor/api/v2/deployments" => [:index, :show],
            :"fusor/api/v21/deployments" => [:index, :show]
          }, :resource_type => 'Fusor::Deployment'
          permission :create_fusor_deployments, {
            :"fusor/api/v2/deployments" => [:create],
            :"fusor/api/v21/deployments" => [:create]
          }, :resource_type => 'Fusor::Deployment'
          permission :edit_fusor_deployments, {
            :"fusor/api/v2/deployments" => [:update],
            :"fusor/api/v21/deployments" => [:update]
          }, :resource_type => 'Fusor::Deployment'
          permission :destroy_fusor_deployments, {
            :"fusor/api/v2/deployments" => [:destroy],
            :"fusor/api/v21/deployments" => [:destroy]
          }, :resource_type => 'Fusor::Deployment'
        end

        # Add a new role called 'Fusor' if it doesn't exist
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
      ::Hostgroup.send :include, Fusor::Concerns::HostgroupExtensions
      ::Host::Managed.send :include, Fusor::Concerns::HostOrchestrationBuildHook
      # The following line disabled CSRF and should only be uncommented in development environments
      # ::ActionController::Base.send :include, Fusor::Concerns::ApplicationControllerExtension
    end

    rake_tasks do
      Rake::Task['db:seed'].enhance do
        Fusor::Engine.load_seed
      end
    end

  end
end
