module Fusor
  class DeploymentSerializer < ActiveModel::Serializer

    embed :ids, include: true
    attributes :id, :name, :description,
               :deploy_rhev, :deploy_cfme, :deploy_openstack,
               :rhev_engine_hostname, :rhev_engine_admin_password,
               :rhev_database_name, :rhev_cluster_name, :rhev_storage_name,
               :rhev_storage_type, :rhev_storage_address, :rhev_cpu_type, :rhev_share_path,
               :rhev_is_self_hosted, :cfme_install_loc,
               :created_at, :updated_at
    has_one :organization, serializer: ::OrganizationSerializer
    has_one :lifecycle_environment, serializer: ::LifecycleEnvironmentSerializer
    has_one :rhev_engine_host, serializer: ::HostSerializer
#    has_many :rhev_hypervisor_hosts, serializer: ::HostSerializer

    has_one :discovered_host, serializer: ::HostSerializer
    has_many :discovered_hosts, serializer: ::HostSerializer

  end
end
