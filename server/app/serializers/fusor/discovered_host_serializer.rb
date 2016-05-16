module Fusor
  class DiscoveredHostSerializer < ActiveModel::Serializer
    include ActionView::Helpers::NumberHelper

    type :discovered_hosts

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

    def cpus
      if is_managed
        object.facts_hash['processorcount']
      elsif is_discovered
        1 #comment object.cpu_count
      end
    end

    def memory_human_size
      if is_managed
        object.facts_hash['memorysize']
      elsif is_discovered
        return "0 MB"
        # return "0 MB" if object.memory.blank? || object.memory.to_i == 0
        # number_to_human_size(object.memory.to_i * 1024 * 1024)
      end
    end

    def disk_count
      if is_managed
        # what is fact for disk count of managed houst??
      elsif is_discovered
        0
        #object.disk_count
      end
    end

    def disks_human_size
      if is_managed
        object.facts_hash['blockdevice_vda_size']
      elsif is_discovered
        return "0 MB"
        # return "0 MB" if object.disks_size.blank? || object.disks_size.to_i == 0
        # number_to_human_size(object.disks_size.to_i * 1024 * 1024)
      end
    end

    def subnet_to_s
      ""
    end

    def is_virtual
      # same for both Discovered and Managed
      object.facts['is_virtual']
    end

    def environment_name
      return object.environment_name if is_managed
    end

    def hostgroup_name
      return object.hostgroup_name if is_managed
    end

    def compute_resource_name
      return object.compute_resource_name if is_managed
    end

    def domain_name
      return object.domain_name if is_managed
    end

  end
end
