module Fusor
  class ForemanTaskSerializer < ActiveModel::Serializer

    type :foreman_tasks

    attributes :id, :label, :pending, :username, :started_at, :ended_at, :state, :result
    attributes :progress, :external_id
    attributes :repository

    def repository
      object.input[:repository][:name] if object.input[:repository]
    end

  end
end
