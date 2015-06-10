require 'test_plugin_helper'

module Actions::Fusor::ActivationKey
  class AddSubscriptionsTest < FusorActionTest

    def setup
      @deployment = fusor_deployments(:rhev)
      @repositories = [ katello_repositories(:fedora_17_x86_64) ]
      @action = create_action AddSubscriptions
      set_user
    end

    test "plan call should call plan_self" do
      Dynflow::Action.any_instance.expects(:plan_self).once
      plan_action @action, @deployment, @repositories
    end

  end
end
