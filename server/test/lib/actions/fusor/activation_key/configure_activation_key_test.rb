require 'test_plugin_helper'

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
      set_user
      ::Katello::ContentView.stubs(:where).returns([@content_view])
    end

    test "plan call should create activation key and plan AddSubscriptions action" do
      plan_action @action, @deployment, @repositories
      assert_action_planed(@action, Create)
      refute_action_planed(@action, Update)
      assert_action_planed_with(@action,
                                AddSubscriptions,
                                @deployment,
                                @repositories)
    end

    test "if AK already exists plan call should update AK and plan AddSubscriptions action" do
      # name is dependent on the definition of activation_key_name()...
      # Not the best...
      key = ::Katello::ActivationKey.new(:organization_id => @deployment.organization.id,
                                         :name => [SETTINGS[:fusor][:activation_key][:name], @deployment.name].join('-'))
      key.save!

      plan_action @action, @deployment, @repositories
      refute_action_planed(@action, Create)
      assert_action_planed(@action, Update)
      assert_action_planed_with(@action,
                                AddSubscriptions,
                                @deployment,
                                @repositories)
    end

    test "there is no run method for ConfigureActivationKey Actions" do
      plan = plan_action(@action, @deployment, @repositories)
      assert_raises(NoMethodError) {
        silence_stream(STDOUT) do
          run_action plan
        end
      }
    end

  end
end
