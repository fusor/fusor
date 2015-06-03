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

    self.set_fixture_class :fusor_deployments => "Fusor::Deployment"
    self.set_fixture_class :fusor_deployment_hosts => "Fusor::DeploymentHost"
    self.set_fixture_class :katello_repositories => "::Katello::Repository"
    self.set_fixture_class :hosts => "::Host::Base"

    load_fixtures
    self.fixture_path = File.join(File.dirname(__FILE__), 'fixtures')
    fixtures(:all)
  end
end

class ActiveSupport::TestCase
  include FixtureTestCase

  def fix_routes()
    @routes = Fusor::Engine.routes
  end
end

class FusorActionTest < ActiveSupport::TestCase
    include Dynflow::Testing
end
