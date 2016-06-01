require 'test_plugin_helper'

module Actions::Fusor::Subscription
  class ManageManifestTest < FusorActionTest
    DownloadManifest = ::Actions::Fusor::Subscription::DownloadManifest
    ManifestImport = ::Actions::Katello::Provider::ManifestImport
    ManifestRefresh = ::Actions::Katello::Provider::ManifestRefresh
    ManifestDelete = ::Actions::Katello::Provider::ManifestDelete

    def setup
      @action = create_action ManageManifest
      @deployment = fusor_deployments(:rhev_and_cfme)
      @credentials = { :username => 'joe', :password => 'password' }
      @path = "/tmp/path"
    end

    test "if no current consumer, download and import manifest" do
      @deployment.organization.stubs(:owner_details => {'upstreamConsumer' => ''})
      plan_action @action, @deployment, @credentials
      assert_action_planed(@action, DownloadManifest)
      assert_action_planed(@action, ManifestImport)
    end

    test "there is no run method for ManageManifest Actions" do
      @deployment.organization.stubs(:owner_details => {'upstreamConsumer' => ''})
      plan = plan_action @action, @deployment, @credentials
      assert_raises(NoMethodError) {
        silence_stream(STDOUT) do
          run_action plan
        end
      }
    end

  end
end
