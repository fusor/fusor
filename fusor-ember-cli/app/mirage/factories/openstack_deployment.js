/*
  This is an example factory definition.

  Create more files in this directory to define additional factories.
*/
import Mirage/*, {faker} */ from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  undercloud_admin_password: 'undercloudAdminPassword',
  undercloud_ip_address: '192.168.234.254',
  undercloud_ssh_username: 'root',
  undercloud_ssh_password: 'vagrant',
  overcloud_address: null,
  overcloud_ext_net_interface: 'nic2',
  overcloud_private_net: '192.168.254.0/24',
  overcloud_float_net: '192.168.253.0/24',
  overcloud_float_gateway: '192.168.253.1',
  overcloud_password: 'overcloudAdminPassword',
  overcloud_libvirt_type: 'kvm',
  overcloud_node_count: 2,
  overcloud_compute_flavor: 'Flavor-16-x86_64-16384-99',
  overcloud_compute_count: 1,
  overcloud_controller_flavor: 'Flavor-16-x86_64-16384-99',
  overcloud_controller_count: 1,
  overcloud_ceph_storage_flavor: 'Flavor-16-x86_64-16384-99',
  overcloud_ceph_storage_count: 0,
  overcloud_block_storage_flavor: 'Flavor-16-x86_64-16384-99',
  overcloud_block_storage_count: 0,
  overcloud_object_storage_flavor: 'Flavor-16-x86_64-16384-99',
  overcloud_object_storage_count: 0,
  overcloud_hostname: null,
  undercloud_hostname: null
});
