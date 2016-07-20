require 'test_plugin_helper'

module Utils::Fusor
  class SubscriptionValidatorTest < ActiveSupport::TestCase
    def setup
      @subval = Fusor::Subscriptions::SubscriptionValidator.new
    end

    test "new disconnected should validate true" do
      deployment = fusor_deployments(:sub_val_disconnected_rhev)
      manifest_imported = false
      disconnected = true
      valid = @subval.validate(deployment, nil, manifest_imported, disconnected)
      assert_equal true, valid
    end

    test "existing manifest should validate true" do
      fusor_subscriptions(:imported) # import a manifest
      deployment = fusor_deployments(:sub_val_subsequent_rhev)
      manifest_imported = true
      disconnected = false
      valid = @subval.validate(deployment, nil, manifest_imported, disconnected)
      assert_equal true, valid
    end

    test "new connected should validate true" do
      #Mod::Utils.stub(:find_x).and_return({something: 'testing'})
      deployment = fusor_deployments(:sub_val_connected_rhev)

      # setup expectations
      session = { :portal_username => "test", :portal_password => "password" }
      auth = { :username => "test", :password => "password" }
      uuid = deployment.upstream_consumer_uuid
      fake_ent_json = '[{"quantity":2, "pool": { "productName":"rhev", "providedProducts":[{"productId":"69"}, {"productId":"150"}, {"productId":"183"}]} }]'

      ::Fusor::Resources::CustomerPortal::Proxy.stubs(:get).with("/consumers/#{uuid}/entitlements", auth).returns(fake_ent_json)

      manifest_imported = false
      disconnected = false

      # validate
      valid = @subval.validate(deployment, session, manifest_imported, disconnected)
      assert_equal true, valid
    end

    test "existing manifest should validate true" do
      fusor_subscriptions(:imported) # import a manifest
      deployment = fusor_deployments(:sub_val_subsequent_rhev)
      manifest_imported = true
      disconnected = false
      valid = @subval.validate(deployment, nil, manifest_imported, disconnected)
      assert_equal true, valid
    end

    test "no credentials should cause error" do
      session = {}
      deployment = fusor_deployments(:sub_val_connected_rhev)
      manifest_imported = false
      disconnected = false
      assert_raise ::Katello::HttpErrors::BadRequest do
        @subval.validate(deployment, session, manifest_imported, disconnected)
      end
    end
  end
end
