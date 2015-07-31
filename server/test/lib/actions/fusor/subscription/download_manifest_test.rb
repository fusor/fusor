require 'test_plugin_helper'

module Actions::Fusor::Subscription
  class DownloadManifestTest < FusorActionTest
    Consumer = ::Fusor::Resources::CustomerPortal::Consumer

    def setup
      @action = create_action DownloadManifest
      @deployment = fusor_deployments(:rhev_and_cfme)
      @credentials = { :username => 'joe', :password => 'password' }
      @path = "/tmp/path"
      set_user
    end

    test "plan call should call plan_self" do
      Dynflow::Action.any_instance.expects(:plan_self).once
      plan_action @action, @deployment, @credentials, @path
    end

    test "cannot download manifest with no username" do
      Dynflow::Action.any_instance.expects(:plan_self).never
      @credentials.delete :username
      assert_raises(RuntimeError) {
        silence_stream(STDOUT) do
          plan_action @action, @deployment, @credentials, @path
        end
      }
    end

    test "cannot download manifest with no password" do
      Dynflow::Action.any_instance.expects(:plan_self).never
      @credentials.delete :password
      assert_raises(RuntimeError) {
        silence_stream(STDOUT) do
          plan_action @action, @deployment, @credentials, @path
        end
      }
    end

    test "cannot download manifest with no consumer uuid" do
      Dynflow::Action.any_instance.expects(:plan_self).never
      @deployment.upstream_consumer_uuid = nil
      assert_raises(RuntimeError) {
        silence_stream(STDOUT) do
          plan_action @action, @deployment, @credentials, @path
        end
      }
    end

    test "run calls upstream and writes manifest" do
      consumer = { 'idCert' => { 'cert' => 'blah', 'key' => 'bleh' } }
      Consumer.expects(:get).once.returns(consumer)
      Consumer.expects(:export).once.returns("manifest")
      File.expects(:open).once
      plan = plan_action @action, @deployment, @credentials, @path
      run_action plan
    end

  end
end
