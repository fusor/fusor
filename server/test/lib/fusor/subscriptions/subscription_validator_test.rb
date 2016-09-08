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

    # BZ 1366338
    test "compare passes if multiple subs have enough to cover the deployment" do
      deployment_si = Fusor::Subscriptions::SubscriptionInfo.new("tpapaioa_3")
      deployment_si.update_counts(:rhev, 1)
      deployment_si.add_product_ids(:rhev, ["69", "150", "183"])
      satellite_si = Fusor::Subscriptions::SubscriptionInfo.new("satellite-tpapaioa_3")
      satellite_si.update_counts("CloudForms Employee Subscription", 20)
      satellite_si.update_counts("RHEV Employee Subscription", 10)
      satellite_si.add_product_ids("CloudForms Employee Subscription", ["201", "69", "205", "180", "240", "167", "303"])
      satellite_si.add_product_ids("RHEV Employee Subscription", ["183", "307", "150", "328"])

      assert_equal true, @subval.send(:compare, deployment_si, satellite_si)
    end

    test "compare fails when not enough entitlements" do
      deployment_si = Fusor::Subscriptions::SubscriptionInfo.new("tpapaioa_3")
      deployment_si.update_counts(:rhev, 2)
      deployment_si.add_product_ids(:rhev, ["69", "150", "183"])
      satellite_si = Fusor::Subscriptions::SubscriptionInfo.new("satellite-tpapaioa_3")
      satellite_si.update_counts("CloudForms Employee Subscription", 1)
      satellite_si.update_counts("RHEV Employee Subscription", 1)
      satellite_si.add_product_ids("CloudForms Employee Subscription", ["201", "69", "205", "180", "240", "167", "303"])
      satellite_si.add_product_ids("RHEV Employee Subscription", ["183", "307", "150", "328"])

      assert_equal false, @subval.send(:compare, deployment_si, satellite_si)
    end

    test "compare fails when at least one not enough entitlements" do
      deployment_si = Fusor::Subscriptions::SubscriptionInfo.new("tpapaioa_3")
      deployment_si.update_counts(:rhev, 2)
      deployment_si.add_product_ids(:rhev, ["69", "150", "183"])
      satellite_si = Fusor::Subscriptions::SubscriptionInfo.new("satellite-tpapaioa_3")
      satellite_si.update_counts("CloudForms Employee Subscription", 1)
      satellite_si.update_counts("RHEV Employee Subscription", 10)
      satellite_si.add_product_ids("CloudForms Employee Subscription", ["201", "69", "205", "180", "240", "167", "303"])
      satellite_si.add_product_ids("RHEV Employee Subscription", ["183", "307", "150", "328"])

      assert_equal false, @subval.send(:compare, deployment_si, satellite_si)
    end

    test "compare passes if subs have enough to cover the deployment" do
      deployment_si = Fusor::Subscriptions::SubscriptionInfo.new("tpapaioa_3")
      deployment_si.update_counts(:rhev, 1)
      deployment_si.add_product_ids(:rhev, ["69", "150", "183"])
      satellite_si = Fusor::Subscriptions::SubscriptionInfo.new("satellite-tpapaioa_3")
      satellite_si.update_counts("RHEV Subscription", 1)
      satellite_si.add_product_ids("RHEV Subscription", ["69", "150", "183"])

      assert_equal true, @subval.send(:compare, deployment_si, satellite_si)
    end

    test "products covered returns false if not enough" do
      dep = ["69", "150", "183"]
      other = ["201", "69", "205", "180", "240", "167", "303"]

      assert_equal false, @subval.send(:products_covered?, dep, other)
    end

    test "products covered returns true if products are a subset" do
      dep = ["69", "150", "183"]
      other = ["69", "183", "307", "150", "328"]

      assert_equal true, @subval.send(:products_covered?, dep, other)
    end

    test "products covered returns true if products are equal" do
      dep = ["69", "150", "183"]
      other = ["69", "183", "150"]

      assert_equal true, @subval.send(:products_covered?, dep, other)
    end

    test "get product ids from config nil key" do
      assert_equal true, @subval.send(:get_product_ids_from_config, nil).empty?
    end

    test "get product ids from config " do
      assert_equal false, @subval.send(:get_product_ids_from_config, /rhev/).empty?
    end

  end
end
