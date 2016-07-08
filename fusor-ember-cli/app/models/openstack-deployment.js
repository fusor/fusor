import DS from 'ember-data';
import Ember from 'ember';
import ValidatedModel from '../mixins/validated-model-mixin';
import {
  PresenceValidator,
  EqualityValidator,
  NumberValidator,
  HostAddressValidator,
  IpAddressValidator,
  IpSubnetValidator,
  CidrValidator,
  AllValidator
} from '../utils/validators';

const PresentHostAddressValidator = AllValidator.extend({
  validators: [
    PresenceValidator.create({}),
    HostAddressValidator.create({})
  ]
});

const FlavorValidator = AllValidator.extend({
  validators: [
    PresenceValidator.create({}),
    EqualityValidator.create({doesNotEqual: 'baremetal'})
  ]
});

const PresentIpValidator = AllValidator.extend({
  validators: [
    PresenceValidator.create({}),
    IpAddressValidator.create({})
  ]
});

const PresentCidrValidator = AllValidator.extend({
  validators: [
    PresenceValidator.create({}),
    CidrValidator.create({})
  ]
});


export default DS.Model.extend(ValidatedModel, {
  undercloud_admin_password: DS.attr('string'),
  undercloud_ip_address: DS.attr('string'),
  undercloud_ssh_username: DS.attr('string'),
  undercloud_ssh_password: DS.attr('string'),

  overcloud_deployed: DS.attr('boolean'),

  overcloud_address: DS.attr('string'),
  overcloud_ext_net_interface: DS.attr('string'),
  overcloud_private_net: DS.attr('string'),
  overcloud_float_net: DS.attr('string'),
  overcloud_float_gateway: DS.attr('string'),
  overcloud_password: DS.attr('string'),
  overcloud_libvirt_type: DS.attr('string'),

  overcloud_node_count: DS.attr('number'),
  overcloud_compute_flavor: DS.attr('string'),
  overcloud_compute_count: DS.attr('number'),
  overcloud_controller_flavor: DS.attr('string'),
  overcloud_controller_count: DS.attr('number'),
  overcloud_ceph_storage_flavor: DS.attr('string'),
  overcloud_ceph_storage_count: DS.attr('number'),
  overcloud_block_storage_flavor: DS.attr('string'),
  overcloud_block_storage_count: DS.attr('number'),
  overcloud_object_storage_flavor: DS.attr('string'),
  overcloud_object_storage_count: DS.attr('number'),

  overcloud_hostname: DS.attr('string'),
  undercloud_hostname: DS.attr('string'),

  external_ceph_storage: DS.attr('boolean'),
  ceph_ext_mon_host: DS.attr('string'),
  ceph_cluster_fsid: DS.attr('string'),
  ceph_client_username: DS.attr('string'),
  ceph_client_key: DS.attr('string'),
  nova_rbd_pool_name: DS.attr('string'),
  cinder_rbd_pool_name: DS.attr('string'),
  glance_rbd_pool_name: DS.attr('string'),

  validations: Ember.Object.create({
    undercloud_admin_password: PresenceValidator.create({}),
    undercloud_ip_address: PresentHostAddressValidator.create({}),
    undercloud_ssh_username: PresenceValidator.create({}),
    undercloud_ssh_password: PresenceValidator.create({}),
    overcloud_deployed: EqualityValidator.create({equals: false}),
    overcloud_node_count: NumberValidator.create({min: 2}),
    overcloud_compute_flavor: FlavorValidator.create({}),
    overcloud_compute_count: NumberValidator.create({min: 1}),
    overcloud_controller_flavor: FlavorValidator.create({}),
    overcloud_controller_count: NumberValidator.create({min: 1}),
    overcloud_ext_net_interface: PresenceValidator.create({}),
    overcloud_private_net: PresentCidrValidator.create({}),
    overcloud_float_net: PresentCidrValidator.create({}),
    overcloud_float_gateway: PresentIpValidator.create({}),
    overcloud_password: PresenceValidator.create({}),
    external_ceph_storage: null,
    ceph_ext_mon_host: null,
    ceph_cluster_fsid: null,
    ceph_client_username: null,
    ceph_client_key: null,
    nova_rbd_pool_name: null,
    cinder_rbd_pool_name: null,
    glance_rbd_pool_name: null
  }),

  onOvercloudFloatNetChanged: Ember.on('init', Ember.observer('overcloud_float_net', function () {
    this.set('validations.overcloud_float_gateway', IpSubnetValidator.create({subnet: this.get('overcloud_float_net')}));
  })),

  onExternalCephStorageChanged: Ember.on('init', Ember.observer('external_ceph_storage', function () {
    if (this.get('external_ceph_storage')) {
      this.set('validations.ceph_ext_mon_host', PresentIpValidator.create({}));
      this.set('validations.ceph_cluster_fsid', PresenceValidator.create({}));
      this.set('validations.ceph_client_username', PresenceValidator.create({}));
      this.set('validations.ceph_client_key', PresenceValidator.create({}));
      this.set('validations.nova_rbd_pool_name', PresenceValidator.create({}));
      this.set('validations.cinder_rbd_pool_name', PresenceValidator.create({}));
      this.set('validations.glance_rbd_pool_name', PresenceValidator.create({}));
    } else {
      this.set('validations.ceph_ext_mon_host', null);
      this.set('validations.ceph_cluster_fsid', null);
      this.set('validations.ceph_client_username', null);
      this.set('validations.ceph_client_key', null);
      this.set('validations.nova_rbd_pool_name', null);
      this.set('validations.cinder_rbd_pool_name', null);
      this.set('validations.glance_rbd_pool_name', null);
    }
  })),

  isUndercloudConnected: Ember.computed(
    'undercloud_admin_password',
    'undercloud_ip_address',
    'undercloud_ssh_username',
    'undercloud_ssh_password',
    function () {
      return this.validate(
        'undercloud_admin_password',
        'undercloud_ip_address',
        'undercloud_ssh_username',
        'undercloud_ssh_password');
    }),


  isUndercloudReady: Ember.computed(
    'isUndercloudConnected',
    'overcloud_deployed',
    function () {
      return this.get('isUndercloudConnected') && this.validate('overcloud_deployed');
    }),

  areNodesRegistered: Ember.computed('overcloud_node_count', function () {
    return this.validate('overcloud_node_count');
  }),

  hasValidNodeAssignments: Ember.computed(
    'overcloud_compute_flavor',
    'overcloud_compute_count',
    'overcloud_controller_flavor',
    'overcloud_controller_count',
    function () {
      return this.validate(
        'overcloud_compute_flavor',
        'overcloud_compute_count',
        'overcloud_controller_flavor',
        'overcloud_controller_count');
    }),

  isValidOvercloud: Ember.computed(
    'overcloud_ext_net_interface',
    'overcloud_private_net',
    'overcloud_float_net',
    'overcloud_float_gateway',
    'validations.overcloud_float_gateway',
    'overcloud_password',
    'ceph_ext_mon_host',
    'validations.ceph_ext_mon_host',
    'ceph_cluster_fsid',
    'validations.ceph_cluster_fsid',
    'ceph_client_username',
    'validations.ceph_client_username',
    'ceph_client_key',
    'validations.ceph_client_key',
    'nova_rbd_pool_name',
    'validations.nova_rbd_pool_name',
    'cinder_rbd_pool_name',
    'validations.cinder_rbd_pool_name',
    'glance_rbd_pool_name',
    'validations.glance_rbd_pool_name',
    function () {
      return this.validate(
        'overcloud_ext_net_interface',
        'overcloud_private_net',
        'overcloud_float_net',
        'overcloud_float_gateway',
        'overcloud_password',
        'ceph_ext_mon_host',
        'ceph_cluster_fsid',
        'ceph_client_username',
        'ceph_client_key',
        'nova_rbd_pool_name',
        'cinder_rbd_pool_name',
        'glance_rbd_pool_name'
      );
    }),

  //TODO investigate a cleaner way to watch all fields for changes
  areAllAttributesValid: Ember.computed(
    'undercloud_admin_password',
    'undercloud_ip_address',
    'undercloud_ssh_username',
    'undercloud_ssh_password',
    'overcloud_deployed',
    'overcloud_compute_flavor',
    'overcloud_compute_count',
    'overcloud_controller_flavor',
    'overcloud_controller_count',
    'overcloud_ext_net_interface',
    'overcloud_private_net',
    'overcloud_float_net',
    'overcloud_float_gateway',
    'validations.overcloud_float_gateway',
    'overcloud_password',
    'ceph_ext_mon_host',
    'validations.ceph_ext_mon_host',
    'ceph_cluster_fsid',
    'validations.ceph_cluster_fsid',
    'ceph_client_username',
    'validations.ceph_client_username',
    'ceph_client_key',
    'validations.ceph_client_key',
    'nova_rbd_pool_name',
    'validations.nova_rbd_pool_name',
    'cinder_rbd_pool_name',
    'validations.cinder_rbd_pool_name',
    'glance_rbd_pool_name',
    'validations.glance_rbd_pool_name',
    function () {
      return this.validateAll();
    }),

  cephStorageStatus: Ember.computed('external_ceph_storage', function() {
    if (this.get('external_ceph_storage')) {
      return 'External';
    } else {
      return 'None';
    }
  })
});
