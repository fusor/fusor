module Fusor
  class IntrospectionTaskSerializer < ActiveModel::Serializer

    type :introspection_tasks

    attributes :id, :deployment_id, :task_id, :node_uuid, :mac_address

  end
end
