import Ember from 'ember';
import {
  AllValidator,
  UniquenessValidator,
  MacAddressValidator,
  HostAddressValidator,
  PresenceValidator
} from  "../utils/validators";

export default Ember.Mixin.create({

  drivers: [
    {label: '', value: null},
    {label: 'IPMI Driver', value: 'pxe_ipmitool'},
    {label: 'PXE + SSH', value: 'pxe_ssh'}
  ],

  ipmiVendors: [
    {label: 'Dell', value: 'dell'}
  ],

  ipmiVendor: 'dell',

  virtVendors: [
    {label: 'KVM', value: 'kvm'}
  ],

  virtVendor: 'kvm',

  vendors: Ember.computed('nodeInfo.driver', function () {
    switch (this.get('nodeInfo.driver')) {
    case 'pxe_ssh':
      return this.get('virtVendors');
    case 'pxe_ipmitool':
      return this.get('ipmiVendors');
    default:
      return [];
    }
  }),

  unavailableMacs: Ember.computed('ports', 'nodeInfo.macAddresses.@each.value', function () {
    let enteredMacs = this.get('nodeInfo.macAddresses');
    let unavailableMacs = this.getPortMacAddresses();

    if (enteredMacs) {
      enteredMacs.forEach(mac => {
        if (Ember.isPresent(mac.value)) {
          unavailableMacs.pushObject(mac.value);
        }
      });
    }

    return unavailableMacs;
  }),

  macAddressValidator: Ember.computed('unavailableMacs', function () {
    return AllValidator.create({
      validators: [
        MacAddressValidator.create({}),
        UniquenessValidator.create({selfIncluded: true, existingValues: this.get('unavailableMacs')})
      ]
    });
  }),

  hostAddressValidator: AllValidator.create({
    validators: [
      PresenceValidator.create({}),
      HostAddressValidator.create({})
    ]
  }),

  newNodeVendorLabel: Ember.computed('nodeInfo.driver', function () {
    if (this.get('nodeInfo.driver') === 'pxe_ipmitool') {
      return 'IPMI Vendor';
    }

    return 'Vendor';
  }),

  newNodeAddressLabel: Ember.computed('nodeInfo.driver', function () {
    switch (this.get('nodeInfo.driver')) {
    case 'pxe_ssh':
      return 'SSH Address';
    case 'pxe_ipmitool':
      return 'IPMI Address';
    default:
      return 'Address';
    }
  }),

  newNodeUsernameLabel: Ember.computed('nodeInfo.driver', function () {
    switch (this.get('nodeInfo.driver')) {
    case 'pxe_ssh':
      return 'SSH User';
    case 'pxe_ipmitool':
      return 'IPMI User';
    default:
      return 'Username';
    }
  }),

  newNodePasswordLabel: Ember.computed('nodeInfo.driver', function () {
    switch (this.get('nodeInfo.driver')) {
    case 'pxe_ssh':
      return 'SSH Password';
    case 'pxe_ipmitool':
      return 'IPMI Password';
    default:
      return 'Password';
    }
  }),

  isValidNewNodeManual: Ember.computed(
    'registerNodesMethod',
    'nodeInfo.driver',
    'nodeInfo.address',
    'nodeInfo.username',
    'nodeInfo.password',
    'nodeInfo.macAddresses.@each.value',
    function () {
      let validConnection = this.get('registerNodesMethod') === 'manual' &&
        Ember.isPresent(this.get('nodeInfo.driver')) &&
        Ember.isPresent(this.get('nodeInfo.address')) &&
        Ember.isPresent(this.get('nodeInfo.username')) &&
        Ember.isPresent(this.get('nodeInfo.password')) &&
        this.get('hostAddressValidator').isValid(this.get('nodeInfo.address'));

      if (!validConnection) {
        return false;
      }

      let macAddresses = this.get('nodeInfo.macAddresses');
      if (!macAddresses) {
        return false;
      }

      let numberInvalidMacs = 0,
        numberValidMacs = 0,
        macAddressValidator = this.get('macAddressValidator');

      macAddresses.forEach((macAddress) => {
        if (Ember.isPresent(macAddress.value)) {
          if (macAddressValidator.isValid(macAddress.value)) {
            numberValidMacs++;
          } else {
            numberInvalidMacs++;
          }
        }
      });

      return numberInvalidMacs === 0 && numberValidMacs > 0;
    }),

  getPortMacAddresses() {
    return this.get('ports') ? this.get('ports').map(port => port.address) : [];
  }
});
