require 'test_plugin_helper'

module Fusor
  class Api::V21::SubscriptionsControllerTest < ActionController::TestCase

    def setup
      @subscription = fusor_subscriptions(:imported)
      # magic, without this some of the routes don't resolve for some reason
      fix_routes
    end

    test "index request should return array of subscriptions" do
      response = JSON.parse(get(:index).body)
      assert_response :success
      sources = response['subscriptions'].map { |sub| sub['source'] }
      assert sources.include?(@subscription.source), "Response was not correct, did not include the imported subscription"
    end

    test "show request should return the subscription" do
      response = JSON.parse(get(:show, :id => @subscription.id).body)
      assert_response :success
      assert_equal @subscription.source, response['subscription']['source'], "Response was not correct, subscription was not returned"
    end

    test "update request should successfully update subscription source" do
      new_source = "added"
      response = JSON.parse(put(:update, :id => @subscription.id, subscription: {source: new_source}).body)
      assert_response :success
      assert_equal new_source, response['subscription']['source'], "Response was not correct, source was not updated"
      assert_not_nil Subscription.find_by_source new_source, "The subscription was not really updated in the database"
    end

    test "create request should successfully create subscription" do
      new_source = "added"
      response = nil # set scope
      assert_difference('Subscription.count', +1, 'The number of subscriptions should increase by one if we create a new one') do
        response = JSON.parse(post(:create, {subscription: {
                                              deployment_id: 3,
                                              contract_number: '16700200',
                                              product_name: 'Awesome OS',
                                              quantity_attached: 2,
                                              source: "added"}}).body)
      end
      assert_response :success
      assert_equal new_source, response['subscription']['source'], "Response was not correct, did not return subscription"
      assert_not_nil Subscription.find_by_source new_source, "The subscription was not really created in the database"
    end

  end
end
