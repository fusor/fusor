# This calls the main test_helper in Foreman-core
require 'simplecov'
require 'coveralls'

SimpleCov.formatter = SimpleCov::Formatter::MultiFormatter[
  SimpleCov::Formatter::HTMLFormatter,
  Coveralls::SimpleCov::Formatter
]

# Configures simplecov to only track fusor, egon, and foretello_api_v21 gems
SimpleCov.root(File.join(File.dirname(__FILE__), '../app'))
SimpleCov.start 'rails' do
  filters.clear # This will remove the :root_filter and :bundler_filter that come via simplecov's defaults
  add_filter do |src|
    !(src.filename =~ /^#{SimpleCov.root}/) unless ((src.filename =~ /egon/) || (src.filename =~ /foretello_api_v21/))
  end
  add_group "Egon" do |src_file|
    src_file.filename =~ /egon/
  end
  add_group "Foretello_api_v21" do |src_file|
    src_file.filename =~ /foretello_api_v21/
  end
  add_group "Fusor" do |src_file|
    src_file.filename =~ /fusor/
  end
end

require 'yaml'
require 'test_helper'
require 'dynflow/testing'

# load our settings
SETTINGS.merge! YAML.load_file File.join(File.dirname(__FILE__), '../config/fusor.yaml')

module FixtureTestCase
  extend ActiveSupport::Concern

  included do
    extend ActiveRecord::TestFixtures

    self.use_transactional_fixtures = true
    self.use_instantiated_fixtures = false
    self.pre_loaded_fixtures = true

    # foreman fixtures
    # No need to specify fixture_class for foreman fixtures, class can be
    # inferred due to namespace

    # katello fixtures
    self.set_fixture_class :katello_activation_keys => "Katello::ActivationKey"
    self.set_fixture_class :katello_content_views => "Katello::ContentView"
    self.set_fixture_class :katello_content_view_environments => "Katello::ContentViewEnvironment"
    self.set_fixture_class :katello_content_view_filters => "Katello::ContentViewFilter"
    self.set_fixture_class :katello_content_view_erratum_filter_rules => "Katello::ContentViewErratumFilterRule"
    self.set_fixture_class :katello_content_view_package_filter_rules => "Katello::ContentViewPackageFilterRule"
    self.set_fixture_class :katello_content_view_package_group_filter_rules => "Katello::ContentViewPackageGroupFilterRule"
    self.set_fixture_class :katello_content_view_puppet_modules => "Katello::ContentViewPuppetModule"
    self.set_fixture_class :katello_content_view_puppet_environments => "Katello::ContentViewPuppetEnvironment"
    self.set_fixture_class :katello_content_view_repositories => "Katello::ContentViewRepository"
    self.set_fixture_class :katello_content_view_version_environments => "Katello::ContentViewVersionEnvironment"
    self.set_fixture_class :katello_content_view_versions => "Katello::ContentViewVersion"
    self.set_fixture_class :katello_environment_priors => "Katello::EnvironmentPrior"
    self.set_fixture_class :katello_environments => "Katello::KTEnvironment"
    self.set_fixture_class :katello_gpg_keys => "Katello::GpgKey"
    self.set_fixture_class :katello_products => "Katello::Product"
    self.set_fixture_class :katello_providers => "Katello::Provider"
    self.set_fixture_class :katello_repositories => "Katello::Repository"
    self.set_fixture_class :katello_sync_plans => "Katello::SyncPlan"
    self.set_fixture_class :katello_host_collections => "Katello::HostCollection"
    self.set_fixture_class :katello_systems => "Katello::System"
    self.set_fixture_class :katello_system_host_collections => "Katello::SystemHostCollection"
    self.set_fixture_class :katello_task_statuses => "Katello::TaskStatus"
    self.set_fixture_class :katello_errata => "Katello::Erratum"
    self.set_fixture_class :katello_erratum_packages => "Katello::ErratumPackage"
    self.set_fixture_class :katello_erratum_cves => "Katello::ErratumCve"
    self.set_fixture_class :katello_repository_errata => "Katello::RepositoryErratum"
    self.set_fixture_class :katello_system_errata => "Katello::SystemErratum"
    self.set_fixture_class :katello_content_view_histories => "Katello::ContentViewHistory"
    self.set_fixture_class :katello_package_groups => "Katello::PackageGroup"
    self.set_fixture_class :katello_pool_activation_keys => "Katello::PoolActivationKey"
    self.set_fixture_class :katello_pools => "Katello::Pool"
    self.set_fixture_class :katello_puppet_modules => "Katello::PuppetModule"
    self.set_fixture_class :katello_repository_package_groups => "Katello::RepositoryPackageGroup"
    self.set_fixture_class :katello_repository_puppet_modules => "Katello::RepositoryPuppetModule"
    self.set_fixture_class :katello_repository_rpms => "Katello::RepositoryRpm"
    self.set_fixture_class :katello_rpms => "Katello::Rpm"
    self.set_fixture_class :katello_subscriptions => "Katello::Subscription"

    # fusor fixtures
    self.set_fixture_class :fusor_deployments => "Fusor::Deployment"
    self.set_fixture_class :fusor_deployment_hosts => "Fusor::DeploymentHost"
    self.set_fixture_class :hosts => "::Host::Base"
    self.set_fixture_class :fusor_subscriptions => "Fusor::Subscription"

    load_fixtures
    fixtures(:all)
  end
end

class ActiveSupport::TestCase
  include FixtureTestCase

  def fix_routes()
    @routes = Fusor::Engine.routes
  end

  def set_user(user = nil)
    user ||= users(:admin)
    user = User.find(user) if user.id
    User.current = user
  end
end

class FusorActionTest < ActiveSupport::TestCase
  include Dynflow::Testing
end
