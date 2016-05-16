module Fusor
  class LifecycleEnvironmentSerializer < ActiveModel::Serializer

    type :lifecycle_environments

    attributes :id, :name, :label, :description, :library, :prior_id,
               :created_at, :updated_at

    def prior_id
      object.prior.try(:id)
    end

  end
end
