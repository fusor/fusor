# encoding: utf-8
require 'test_plugin_helper'

class SubscriptionTest < ActiveSupport::TestCase

  test "should not save without a source" do
    subscription = fusor_subscriptions(:imported)
    subscription.source = nil
    assert_raise ActiveRecord::StatementInvalid do
      subscription.save!
    end
  end

end
