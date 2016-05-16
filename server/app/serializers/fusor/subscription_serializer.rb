module Fusor
  class SubscriptionSerializer < ActiveModel::Serializer

    type :subscriptions

    attributes :id, :deployment_id, :contract_number, :product_name,
               :quantity_attached, :start_date, :end_date,
               :total_quantity, :source, :quantity_to_add

  end
end
