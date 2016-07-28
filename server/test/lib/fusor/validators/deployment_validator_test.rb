require 'test_plugin_helper'

module Fusor::Validators
  class DeploymentValidatorTest < ActiveSupport::TestCase
    def setup
      @deploy_val = Fusor::Validators::DeploymentValidator.new
      # create fusor base in test db
      # normally this is done in a fixture but we would have to create our own
      # hostgroup.yml fixture which would have to be merged by a script in our
      # dev environment. it is easier to just create what we need here.
      # apparently we expect the domain to have id 1, so we can't use the
      # domains we currently have in the fixtures
      domain = domains(:mydomain)
      subnet = subnets(:one) # use one from foreman fixtures
      fbase = ::Hostgroup.new(:name => "Fusor Base", :id => 1, :subnet_id => subnet.id, :domain_id => domain.id, :title => "Fusor Base", :lookup_value_matcher => "hostgroup=Fusor Base")
      fbase.save
    end
    test "openshift parameters should return true if all are valid" do
      skip # need to disable because safe_mount.sh would fail in test environment
      deployment = fusor_deployments(:rhev_and_ose)
      valid = @deploy_val.validate_openshift_parameters(deployment)
      assert_equal true, valid
    end
  end
end
