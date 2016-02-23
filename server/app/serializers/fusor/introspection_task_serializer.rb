module Fusor
  class IntrospectionTaskSerializer < ActiveModel::Serializer

    embed :ids, include: true
    attributes :id, :deployment_id, :task_id, :node_uuid, :mac_address

  end
end
