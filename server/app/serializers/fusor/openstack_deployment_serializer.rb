module Fusor
  class OpenstackDeploymentSerializer < ActiveModel::Serializer

    attributes :id,

               :undercloud_admin_password,
               :undercloud_ip_address,
               :undercloud_ssh_username,
               :undercloud_ssh_password,

               :overcloud_deployed,

               :overcloud_address,
               :overcloud_ext_net_interface,
               :overcloud_private_net,
               :overcloud_float_net,
               :overcloud_float_gateway,
               :overcloud_password,
               :overcloud_libvirt_type,

               :overcloud_node_count,
               :overcloud_compute_flavor,
               :overcloud_compute_count,
               :overcloud_controller_flavor,
               :overcloud_controller_count,
               :overcloud_ceph_storage_flavor,
               :overcloud_ceph_storage_count,
               :overcloud_block_storage_flavor,
               :overcloud_block_storage_count,
               :overcloud_object_storage_flavor,
               :overcloud_object_storage_count,

               :overcloud_hostname,
               :undercloud_hostname,

               :external_ceph_storage,
               :ceph_ext_mon_host,
               :ceph_cluster_fsid,
               :ceph_client_username,
               :ceph_client_key,
               :nova_rbd_pool_name,
               :cinder_rbd_pool_name,
               :glance_rbd_pool_name,

               :created_at,
               :updated_at

  end
end
