# encoding: utf-8
require 'test_plugin_helper'

class SubscriptionTest < ActiveSupport::TestCase

  test "should not save without a source" do
    subscription = fusor_subscriptions(:imported)
    subscription.source = nil
    assert_raise ActiveRecord::RecordInvalid do
      subscription.save!
    end
    #assert_equal "is not included in the list", response['errors']['source'][0], "Response message was incorrect"
  end

end
