module Fusor
  class DeploymentSerializer < ActiveModel::Serializer

    embed :ids, include: true
    attributes :id, :name, :label, :description,
               :deploy_rhev, :deploy_cfme, :deploy_openstack, :deploy_openshift,
               :rhev_engine_admin_password,
               :rhev_database_name, :rhev_cluster_name, :rhev_storage_name,
               :rhev_storage_type, :rhev_storage_address, :rhev_cpu_type, :rhev_share_path,
               :rhev_export_domain_name, :rhev_export_domain_address,
               :rhev_export_domain_path, :rhev_local_storage_path,
               :rhev_gluster_node_name, :rhev_gluster_node_address,
               :rhev_gluster_ssh_port, :rhev_gluster_root_password,
               :rhev_is_self_hosted, :cfme_install_loc,
               :foreman_task_uuid, :upstream_consumer_uuid, :upstream_consumer_name,
               :rhev_root_password, :cfme_root_password, :cfme_admin_password,
               :host_naming_scheme, :custom_preprend_name, :enable_access_insights,
               :cfme_address,
               :rhev_engine_host_id,
               :openstack_undercloud_password,
               :openstack_undercloud_ip_addr,
               :openstack_undercloud_user,
               :openstack_undercloud_user_password,
               :openstack_overcloud_address,
               :openstack_overcloud_password,
               :openstack_overcloud_private_net,
               :openstack_overcloud_float_net,
               :openstack_overcloud_float_gateway,
               :openstack_undercloud_hostname,
               :openstack_overcloud_hostname,
               :cfme_hostname,
               :is_disconnected,
               :cdn_url, :manifest_file,
               :openshift_install_loc,
               :openshift_number_nodes,
               :openshift_storage_size,
               :openshift_username,
               :openshift_master_vcpu,
               :openshift_master_ram,
               :openshift_master_disk,
               :openshift_node_vcpu,
               :openshift_node_ram,
               :openshift_node_disk,
               :openshift_available_vcpu,
               :openshift_available_ram,
               :openshift_available_disk,
               :openshift_number_master_nodes,
               :openshift_number_worker_nodes,
               :openshift_storage_type,
               :openshift_storage_name,
               :openshift_storage_desc,
               :openshift_export_path,
               :openshift_username,
               :openshift_subdomain_name,
               :cloudforms_vcpu,
               :cloudforms_ram,
               :cloudforms_vm_disk_size,
               :cloudforms_db_disk_size,
               :created_at, :updated_at


    has_one :organization, serializer: ::OrganizationSerializer
    has_one :lifecycle_environment, serializer: ::LifecycleEnvironmentSerializer
    # has one engine
    has_one :discovered_host, serializer: ::HostBaseSerializer
    # has many hypervisors
    has_many :discovered_hosts, serializer: ::HostBaseSerializer

    has_many :subscriptions, serializer: Fusor::SubscriptionSerializer
    has_many :introspection_tasks, serializer: Fusor::IntrospectionTaskSerializer

    has_one :foreman_task, key: :foreman_task_uuid, serializer: ::ForemanTaskSerializer

  end
end
