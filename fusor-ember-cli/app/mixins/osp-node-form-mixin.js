import Ember from 'ember';
import {
  Validator,
  AllValidator,
  UniquenessValidator,
  MacAddressValidator,
  HostAddressValidator,
  PresenceValidator
} from  "../utils/validators";

export default Ember.Mixin.create({

  drivers: [
    {label: 'Select a driver', value: null},
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

  helpText: Ember.Object.create({
    ipAddress: 'Address to the system that manages the nodes you want to register',
    driver: 'Type of power management interface that manages the nodes you want to register',
    username: 'Administrator username for the system that manages the nodes you want to register',
    password: 'Password for the system that manages the nodes you want to register'
  }),

  vendors: Ember.computed('nodeInfo.driver', function () {
    switch (this.get('nodeInfo.driver')) {
    case 'pxe_ssh':
      return this.get('virtVendors');
    case 'pxe_ipmitool':
      return this.get('ipmiVendors');
    default:
      return [{label: 'Select a vendor', value: null}];
    }
  }),

  manualMacAddressesValidator: Ember.computed('ports', function () {
    let unavailableMacAddresses = this.getPortMacAddresses();


    return Validator.create({
      isValid(value) {
        if (Ember.isBlank(value)) {
          return false;
        }

        let macArray = this.getMacAddressArray(value);
        let singleValidator = this.createSingleMacValidators(macArray);

        return macArray.every(macAddress => singleValidator.isValid(macAddress));
      },

      getMessages(value) {
        if (Ember.isBlank(value)) {
          return ['This field cannot be blank.'];
        }

        let macArray = this.getMacAddressArray(value);
        let singleValidator = this.createSingleMacValidators(macArray);
        let messages = [];

        macArray.forEach(macAddress => {
          let messagesForSingleMac = singleValidator.getMessages(macAddress);
          messagesForSingleMac.forEach(message => {
            messages.push(`${macAddress}: ${message}`);
          });
        });

        return messages.uniq();
      },

      createSingleMacValidators(macAddressArray) {
        let existingValues = macAddressArray.concat(unavailableMacAddresses);

        return AllValidator.create({
          validators: [
            MacAddressValidator.create({}),
            UniquenessValidator.create({selfIncluded: true, existingValues: existingValues})
          ]
        });
      },

      getMacAddressArray(macAddressesString) {
        if (Ember.isBlank(macAddressesString)) {
          return [];
        }

        return macAddressesString.split('\n')
          .filter(mac => Ember.isPresent(mac))
          .map(mac => mac.trim());
      }
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

  isValidConnectionInfo: Ember.computed(
    'nodeInfo.driver',
    'nodeInfo.address',
    'nodeInfo.username',
    'nodeInfo.password',
    function () {
      return Ember.isPresent(this.get('nodeInfo.driver')) &&
        Ember.isPresent(this.get('nodeInfo.address')) &&
        Ember.isPresent(this.get('nodeInfo.username')) &&
        Ember.isPresent(this.get('nodeInfo.password')) &&
        this.get('hostAddressValidator').isValid(this.get('nodeInfo.address'));
    }),

  isValidNewNodeManual: Ember.computed(
    'isNewNodeMethodManual',
    'isValidConnectionInfo',
    'manualMacAddresses',
    'manualMacAddressesValidator',
    function () {
      let manualMacAddressesValidator = this.get('manualMacAddressesValidator');

      if (!manualMacAddressesValidator) {
        return false;
      }

      return this.get('isNewNodeMethodManual') && this.get('isValidConnectionInfo') &&
        manualMacAddressesValidator.isValid(this.get('manualMacAddresses'));
    }),

  getPortMacAddresses() {
    return this.get('ports') ? this.get('ports').map(port => port.address) : [];
  },

  prepManualNodeInfo() {
    let macAddressesArray = this.get('manualMacAddresses').split('\n')
      .filter(mac => Ember.isPresent(mac))
      .map(mac => Ember.Object.create({value: mac.trim()}));

    this.get('nodeInfo').set('macAddresses', macAddressesArray);
  }
});
