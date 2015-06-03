require 'test_plugin_helper'

module Actions::Fusor::ActivationKey
  class AddSubscriptionsTest < FusorActionTest

    def setup
      @deployment = fusor_deployments(:rhev)
      @repositories = [ katello_repositories(:fedora_17_x86_64) ]
      id = stub(:id => 1)
      @deployment.stubs(:organization).returns(id)
      ::User.stubs(:current).returns(id)
      @action = create_action AddSubscriptions
    end

    test "plan call should call plan_self" do
      Dynflow::Action.any_instance.expects(:plan_self).once
      plan_action @action, @deployment, @repositories
    end

  end
end
