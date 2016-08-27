require 'test_plugin_helper'
require "fusor/multilog"
require "fusor/deployment_logger"

module Actions::Fusor::ActivationKey
  class ConfigureActivationKeyTest < FusorActionTest
    AddSubscriptions = ::Actions::Fusor::ActivationKey::AddSubscriptions
    Update = ::Actions::Katello::ActivationKey::Update
    Create = ::Actions::Fusor::ActivationKey::Create

    def setup
      @deployment = fusor_deployments(:rhev)
      @repositories = [katello_repositories(:fedora_17_x86_64)]
      @content_view = katello_content_views(:library_view)
      @action = create_action ConfigureActivationKey
      @hostgroup_params = {
        :name => "testhg",
        :activation_key => {:name => "test-key",
                            :subscription_descriptions => ["Test"]
      }}
      set_user
      ::Katello::ContentView.stubs(:where).returns([@content_view])
    end

    test "plan call should create activation key and plan AddSubscriptions action" do
      key = stub(:id => 100)
      ::Katello::ActivationKey.stubs(:new).returns(key)
      plan_action @action, @deployment, @hostgroup_params, @repositories
      assert_action_planed(@action, Create)
      refute_action_planed(@action, Update)
      assert_action_planed_with(@action,
                                AddSubscriptions,
                                100,
                                @hostgroup_params,
                                ["Test"],
                                @repositories)
    end

    test "if AK already exists plan call should update AK and plan AddSubscriptions action" do
      key = ::Katello::ActivationKey.new(:organization_id => @deployment.organization.id,
                                         :name => "test_key-rhev-testhg")
      key.save!

      plan_action @action, @deployment, @hostgroup_params, @repositories
      refute_action_planed(@action, Create)
      assert_action_planed(@action, Update)
      assert_action_planed_with(@action,
                                AddSubscriptions,
                                key.id,
                                @hostgroup_params,
                                ["Test"],
                                @repositories)
    end

    test "there is no run method for ConfigureActivationKey Actions" do
      plan = plan_action(@action, @deployment, @hostgroup_params, @repositories)
      assert_raises(NoMethodError) {
        silence_stream(STDOUT) do
          run_action plan
        end
      }
    end

  end
end
