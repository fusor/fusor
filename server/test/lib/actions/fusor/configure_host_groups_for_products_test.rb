require 'test_plugin_helper'

module Actions::Fusor
  class ConfigureHostGroupsForProductsTest < FusorActionTest
    ConfigureActivationKey = ::Actions::Fusor::ActivationKey::ConfigureActivationKey
    ConfigureHostGroups = ::Actions::Fusor::ConfigureHostGroups
    ConfigureHostGroupsForProducts = ::Actions::Fusor::ConfigureHostGroupsForProducts

    def setup
      @task = create_action ConfigureHostGroupsForProducts
      @deployment = fusor_deployments(:rhev_and_cfme)
      @repositories = [katello_repositories(:fedora_17_x86_64), katello_repositories(:rhel_7_x86_64)]
      ConfigureHostGroupsForProducts.any_instance
        .stubs(:retrieve_deployment_repositories).returns(@repositories)
      ConfigureHostGroupsForProducts.any_instance
        .stubs(:yum_repositories).returns(@repositories)
    end

    test "plan call should schedule appropriate actions" do
      plan_action(@task, @deployment.id)

      rhev = SETTINGS[:fusor][:host_groups][:rhev][:host_groups]

      assert_action_planed_with(@task,
                                ConfigureActivationKey,
                                @deployment,
                                rhev[1],
                                @repositories)

      assert_action_planed_with(@task,
                                ConfigureActivationKey,
                                @deployment,
                                rhev.last,
                                @repositories)

      assert_action_planed_with(@task,
                                ConfigureHostGroups,
                                @deployment,
                                :rhev,
                                SETTINGS[:fusor][:host_groups][:rhev])
    end
  end
end
