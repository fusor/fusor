import DS from 'ember-data';
import Ember from 'ember';
import ValidatedModel from '../mixins/validated-model-mixin';
import {
  PresenceValidator,
  EqualityValidator,
  NumberValidator,
  HostAddressValidator,
  IpAddressValidator,
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

const PresentCidrValidator= AllValidator.extend({
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

  validations: Ember.Object.create({
    undercloud_admin_password: PresenceValidator.create({}),
    undercloud_ip_address: PresentHostAddressValidator.create({}),
    undercloud_ssh_username: PresenceValidator.create({}),
    undercloud_ssh_password: PresenceValidator.create({}),
    overcloud_node_count: NumberValidator.create({min: 2}),
    overcloud_compute_flavor: FlavorValidator.create({}),
    overcloud_compute_count: NumberValidator.create({min: 1}),
    overcloud_controller_flavor: FlavorValidator.create({}),
    overcloud_controller_count: NumberValidator.create({min: 1}),
    overcloud_ext_net_interface: PresenceValidator.create({}),
    overcloud_private_net: PresentCidrValidator.create({}),
    overcloud_float_net: PresentCidrValidator.create({}),
    overcloud_float_gateway: PresentIpValidator.create({}),
    overcloud_password: PresenceValidator.create({})
  }),

  isUndercloudDeployed: Ember.computed(
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
    'overcloud_password',
    function () {
      return this.validate(
        'overcloud_ext_net_interface',
        'overcloud_private_net',
        'overcloud_float_net',
        'overcloud_float_gateway',
        'overcloud_password');
    }),

  //TODO investigate a cleaner way to watch all fields for changes
  areAllAttributesValid: Ember.computed(
    'undercloud_admin_password',
    'undercloud_ip_address',
    'undercloud_ssh_username',
    'undercloud_ssh_password',
    'overcloud_compute_flavor',
    'overcloud_compute_count',
    'overcloud_controller_flavor',
    'overcloud_controller_count',
    'overcloud_ext_net_interface',
    'overcloud_private_net',
    'overcloud_float_net',
    'overcloud_float_gateway',
    'overcloud_password',
    function() {
      return this.validateAll();
    }
  )
});
