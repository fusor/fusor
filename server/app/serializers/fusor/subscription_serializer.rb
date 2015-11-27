module Fusor
  class SubscriptionSerializer < ActiveModel::Serializer

    embed :ids, include: true
    attributes :id, :deployment_id, :contract_number, :product_name, :quantity_attached, :start_date, :end_date, :total_quantity, :source

  end
end
