require 'test_plugin_helper'

module Actions::Fusor::ActivationKey
  class AddSubscriptionsTest < FusorActionTest

    def setup
      @deployment = fusor_deployments(:rhev)
      @repositories = [katello_repositories(:fedora_17_x86_64)]
      @activation_key = katello_activation_keys(:simple_key)
      @action = create_action AddSubscriptions
      @descriptions = ["Red Hat Cloud Infrastructure"]
      @hostgroup = {
        :name => "testhg",
        :activation_key => {:name => "test-key",
                            :content => "rhevm",
                            :subscription_descriptions => ["Test"]
      }}
      # use one of the keys already defined by katllo, we won't have
      # created our own in this unit test
      ::Katello::ActivationKey.stubs(:find_by_id).returns(@activation_key)
      set_user
    end

    test "plan call should call plan_self" do
      Dynflow::Action.any_instance.expects(:plan_self).once
      plan_action @action, @activation_key.id, @hostgroup, @descriptions, @repositories
    end

    test "run should add subscriptions to the key" do
      ::Katello::ActivationKey.stubs(:find).returns(@activation_key)
      @activation_key.expects(:set_content_override).once
      products = SETTINGS[:fusor][:content][:rhevm].map { |p| p[:product_id] }.uniq
      @activation_key.expects(:add_custom_product).with() {|p| products.include? p.to_s }.at_least_once
      plan = plan_action @action, @activation_key.id, @hostgroup, @descriptions, @repositories
      run_action plan
    end
  end
end
