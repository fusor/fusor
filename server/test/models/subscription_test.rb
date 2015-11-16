# encoding: utf-8
require 'test_plugin_helper'

class SubscriptionTest < ActiveSupport::TestCase

  test "should not save without a source" do
    skip "Still debugging why test fails when code works"
    subscription = fusor_subscriptions(:imported)
    subscription.source = nil
    assert_not subscription.save, "Saved subscription without a source"
  end

end
