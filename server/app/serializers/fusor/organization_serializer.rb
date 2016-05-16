module Fusor
  class OrganizationSerializer < ActiveModel::Serializer

    type :organizations

    attributes :id, :name, :title, :parent_id, :parent_name, :created_at, :updated_at,
               :ancestry, :description
   end
end
