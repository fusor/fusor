require 'test_plugin_helper'

module Actions::Fusor::ActivationKey
  class AddSubscriptionsTest < FusorActionTest

    def setup
      @deployment = fusor_deployments(:rhev)
      @repositories = [ katello_repositories(:fedora_17_x86_64) ]
      @activation_key = katello_activation_keys(:simple_key)
      @action = create_action AddSubscriptions
      # use one of the keys already defined by katllo, we won't have
      # created our own in this unit test
      ::Katello::ActivationKey.stubs(:where).returns([@activation_key])
      set_user
    end

    test "plan call should call plan_self" do
      Dynflow::Action.any_instance.expects(:plan_self).once
      plan_action @action, @deployment, @repositories
    end

    test "run should add subscriptions to the key" do
      @activation_key.stubs(:available_subscriptions).returns(stub(:find_all => [stub('subscription', :cp_id => 1)]))
      @activation_key.expects(:subscribe).once.returns(1)
      @activation_key.expects(:set_content_override).once
      plan = plan_action @action, @deployment, @repositories
      run_action plan
    end

  end
end
