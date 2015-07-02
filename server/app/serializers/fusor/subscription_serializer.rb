module Fusor
  class SubscriptionSerializer < ActiveModel::Serializer

    embed :ids, include: true
    attributes :id, :deployment_id, :contract_number, :product_name, :quantity_attached

  end
end
