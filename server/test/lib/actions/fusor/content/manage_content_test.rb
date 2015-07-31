require 'test_plugin_helper'

module Actions::Fusor::Content
  class ManageContentTest < FusorActionTest
    EnableRepositories = ::Actions::Fusor::Content::EnableRepositories
    SyncRepositories = ::Actions::Fusor::Content::SyncRepositories
    PublishContentView = ::Actions::Fusor::Content::PublishContentView
    ConfigureActivationKey = ::Actions::Fusor::ActivationKey::ConfigureActivationKey
    ConfigureHostGroups = ::Actions::Fusor::ConfigureHostGroups

    def setup
      @deploy = create_action ManageContent
      @deployment = fusor_deployments(:rhev_and_cfme)
      @repositories = [katello_repositories(:fedora_17_x86_64), katello_repositories(:rhel_7_x86_64)]
      # stub out a few methods to return predicatble data for validation
      @deploy.stubs(:retrieve_deployment_repositories).returns(@repositories)
      @deploy.stubs(:yum_repositories).returns(@repositories)
    end

    test "plan call should schedule appropriate actions" do
      plan_action(@deploy, fusor_deployments(:rhev_and_cfme))

      content = SETTINGS[:fusor][:content][:rhev] + SETTINGS[:fusor][:content][:cloudforms]
      assert_action_planed_with(@deploy,
                                EnableRepositories,
                                @deployment.organization,
                                content)

      assert_action_planed_with(@deploy, SyncRepositories, @repositories)

      assert_action_planed_with(@deploy,
                                PublishContentView,
                                @deployment,
                                @repositories)

      assert_action_planed_with(@deploy,
                                ConfigureActivationKey,
                                @deployment,
                                @repositories)

      assert_action_planed_with(@deploy,
                                ConfigureHostGroups,
                                @deployment,
                                :rhev,
                                SETTINGS[:fusor][:host_groups][:rhev])
    end

    test "there is no run method for ManageContent Actions" do
      action = plan_action(@deploy, fusor_deployments(:rhev_and_cfme))
      assert_raises(NoMethodError) {
        silence_stream(STDOUT) do
          run_action action
        end
      }
    end

  end
end
