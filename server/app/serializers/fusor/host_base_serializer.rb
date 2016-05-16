module Fusor
  class HostBaseSerializer < ActiveModel::Serializer
    include ActionView::Helpers::NumberHelper

    type :hosts

    attributes :id, :name, :type, :ip, :mac,
               :created_at, :updated_at,
               :cpus, :memory_human_size, :disks_human_size, :disk_count,
               :subnet_to_s, :is_virtual,

               :environment_name, :hostgroup_name, :compute_resource_name, :domain_name,
               :is_managed, :is_discovered

    def is_managed
      object.type == "Host::Managed"
    end

    def is_discovered
      object.type == "Host::Discovered"
    end

    def ip
      object.ip
    end

    #TODO HOST BASE more attributes

  end
end
