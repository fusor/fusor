require 'test_plugin_helper'

module Utils::Fusor
  class SubscriptionInfoTest < ActiveSupport::TestCase
    def setup
      #@subval = Fusor::Subscriptions::SubscriptionValidator.new
    end

    test "product key should return multiple keys" do
      si = Fusor::Subscriptions::SubscriptionInfo.new("satellite-tpapaioa_3")
      si.update_counts("awesome product", 20)
      si.update_counts("another awesome product", 10)
      si.update_counts("should not get returned", 1)
      si.add_product_ids("awesome product", ["201", "69", "205", "180", "240", "167", "303"])
      si.add_product_ids("another awesome product", ["183", "307", "150", "328"])
      si.add_product_ids("should not get returned", ["1", "3", "15", "32"])
      keys = si.get_product_keys(["69", "183", "150"])
      assert_equal false, keys.nil?
      assert_equal false, keys.empty?
      assert_equal 2, keys.count
      assert_equal true, (["awesome product", "another awesome product"] - keys).empty?
    end

    test "product key should return empty" do
      si = Fusor::Subscriptions::SubscriptionInfo.new("satellite-tpapaioa_3")
      si.update_counts("awesome product", 20)
      si.add_product_ids("awesome product", ["201", "69", "205", "180", "240", "167", "303"])
      keys = si.get_product_keys(["6", "18", "15"])
      assert_equal false, keys.nil?
      assert_equal true, keys.empty?
      assert_equal 0, keys.count
    end

    test "product ids updated by add" do
      si = Fusor::Subscriptions::SubscriptionInfo.new("add-products")
      ids = ["10", "20", "30"]
      si.add_product_ids(:product, ids)
      assert_equal false, si.get_product_ids.empty?
      # ensure the sets are equal
      assert_equal true, (si.get_product_ids[:product] - ids).empty?
    end

    test "add products removes duplicates" do
      si = Fusor::Subscriptions::SubscriptionInfo.new("add-products")
      ids = ["10", "30", "20", "30", "20"]
      si.add_product_ids(:product, ids)
      assert_equal false, si.get_product_ids.empty?
      assert_equal 3, si.get_product_ids[:product].count
    end

    test "update counts" do
      si = Fusor::Subscriptions::SubscriptionInfo.new("update-counts")
      si.update_counts(:product, 10)
      assert_equal 10, si.get_counts_by_name(:product)
      si.update_counts(:product, 20)
      assert_equal 30, si.get_counts_by_name(:product)
    end

    test "update counts handles nil" do
      si = Fusor::Subscriptions::SubscriptionInfo.new("update-counts")
      si.update_counts(:product, nil)
      assert_equal 0, si.get_counts_by_name(:product)
    end

    test "flatten products" do
      si = Fusor::Subscriptions::SubscriptionInfo.new("flatten")
      ids1 = ["10", "20", "30"]
      ids2 = ["30", "40", "50"]
      si.add_product_ids(:product1, ids1)
      si.add_product_ids(:product2, ids2)
      assert_equal 5, si.flatten_product_ids.count
      combined = ids1 + ids2
      assert_equal combined.uniq, si.flatten_product_ids
    end
  end
end
