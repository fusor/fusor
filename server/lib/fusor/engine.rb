module Fusor
  class Engine < ::Rails::Engine
    isolate_namespace Fusor

    config.autoload_paths += Dir["#{config.root}/app/controllers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/helpers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/models/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/overrides"]
    config.autoload_paths += Dir["#{config.root}/app/serializers"]
    config.autoload_paths += Dir["#{config.root}/lib/modules"]

    # Add any db migrations
    initializer "fusor.load_app_instance_data" do |app|
      Fusor::Engine.paths['db/migrate'].existent.each do |migrate_file|
        app.config.paths['db/migrate'] << migrate_file
      end
    end

    initializer 'fusor.mount_engine', :after => :build_middleware_stack do |app|
      app.routes_reloader.paths << "#{Fusor::Engine.root}/config/routes/mount_engine.rb"
    end

    # Load this before the Foreman config initializers, so that the Setting.descendants
    # list includes the plugin STI setting class
    initializer 'fusor.load_default_settings', :before => :load_config_initializers do |app|
      require_dependency File.expand_path("#{Fusor::Engine.root}/app/models/setting/openshift.rb", __FILE__) if (Setting.table_exists? rescue(false))
      require_dependency File.expand_path("#{Fusor::Engine.root}/app/models/setting/cloudforms.rb", __FILE__) if (Setting.table_exists? rescue(false))
    end

    initializer "fusor.paths" do |app|
      app.routes_reloader.paths << "#{Fusor::Engine.root}/config/routes/api/v2.rb"
      app.routes_reloader.paths << "#{Fusor::Engine.root}/config/routes/api/v21.rb"
      app.routes_reloader.paths << "#{Fusor::Engine.root}/config/routes/api/openstack.rb"
      app.routes_reloader.paths << "#{Fusor::Engine.root}/config/routes/api/customer_portal.rb"
    end

    initializer 'fusor.register_plugin' do |app|
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
      Apipie.configuration.api_controllers_matcher << "#{Fusor::Engine.root}/app/controllers/fusor/api/v21/*.rb"
      Apipie.configuration.api_controllers_matcher << "#{Fusor::Engine.root}/app/controllers/fusor/api/openstack/*.rb"
      Apipie.configuration.api_controllers_matcher << "#{Fusor::Engine.root}/app/controllers/fusor/api/customer_portal/*.rb"
      Apipie.configuration.checksum_path += ['/fusor/api']
      # Reset languages when generating html docs using rake apipie:static[fusor_v21] to omit localized versions
      # Apipie.configuration.languages = []
    end

    #Include concerns in this config.to_prepare block
    config.to_prepare do
      # include concerns
      ::Hostgroup.send :include, Fusor::Concerns::HostgroupExtensions
      ::Host::Managed.send :include, Fusor::Concerns::HostOrchestrationBuildHook
      ::Host::Managed.send :include, Fusor::Concerns::HostExtensions
      # The following line disabled CSRF and should only be uncommented in development environments
      # ::ActionController::Base.send :include, Fusor::Concerns::ApplicationControllerExtension

      # preload all the Foreman's lib files but only in production
      #   Based on workaround Staypuft identified, related to race condition of loading certain foreman modules
      #   https://github.com/theforeman/foreman/pull/1577#issuecomment-48703612
      if Rails.env.production?
        Dir.glob(File.join(Rails.root, 'lib', '**', '*.rb')).
            map { |p| p.to_s.gsub "#{Rails.root}/lib/", '' }.
            map { |v| v.gsub /\.rb$/, '' }.
            sort_by { |v| v.scan('/').size }. # ordered by the directory depth
            map { |v| require_dependency v }
      end
    end

    # show fusor packages in the installed packages box on /about
    initializer 'fusor.about.pkgs' do
      ::Katello::Ping::PACKAGES.push("fusor")
    end

    rake_tasks do
      Rake::Task['db:seed'].enhance do
        Fusor::Engine.load_seed
      end
    end

  end
end
