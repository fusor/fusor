# This calls the main test_helper in Foreman-core
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
    self.set_fixture_class :katello_distributors => "Katello::Distributor"
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

    # fusor fixtures
    self.set_fixture_class :fusor_deployments => "Fusor::Deployment"
    self.set_fixture_class :fusor_deployment_hosts => "Fusor::DeploymentHost"
    self.set_fixture_class :hosts => "::Host::Base"

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
