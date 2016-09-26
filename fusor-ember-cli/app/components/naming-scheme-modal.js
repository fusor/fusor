import Ember from 'ember';

export default Ember.Component.extend({

  onOpenModal: Ember.observer('openModal', function() {
    if (this.get('openModal')) {
      let customPreprendName = this.get('customPreprendName');
      this.set('origCustomPreprendName', customPreprendName);
    }
  }),

  isFreeform: Ember.computed('hostNamingScheme', function() {
    return (this.get('hostNamingScheme') === 'Freeform');
  }),

  isMac: Ember.computed('hostNamingScheme', function() {
    return (this.get('hostNamingScheme') === 'MAC address');
  }),

  isCustomScheme: Ember.computed('hostNamingScheme', function() {
    return (this.get('hostNamingScheme') === 'Custom scheme');
  }),

  isHypervisorN: Ember.computed('hostNamingScheme', function() {
    return (this.get('hostNamingScheme') === 'hypervisorN');
  }),

  invalidCustomPrefix: Ember.computed('hostNamingScheme', 'customPreprendName', function() {
    if (this.get('hostNamingScheme') !== 'Custom scheme') {
      return false;
    } else {
      return !this.get('customPrefixValidator').isValid(this.get('customPreprendName'));
    }
  }),

  customPreprendNameTrimmed: Ember.computed('customPreprendName', function() {
    let name = this.get('customPreprendName');
    return name ? name.trim() : name;
  }),

  actions: {
    saveNamingScheme() {
      // field name provided by setSelectValue below
      let fieldName = this.get('lookupName');
      let selectionValue = this.get(fieldName);

      // triggers action updating hostNamingScheme on deployment model
      this.sendAction('setSelectValue', fieldName, selectionValue);
      this.set('openModal', false);
      this.sendAction('saveNamingScheme');
    },

    cancelNamingScheme() {
      this.set('openModal', false);
      this.set('customPreprendName', this.get('origCustomPreprendName'));
      this.set('origCustomPreprendName', null);
      this.sendAction('cancelNamingScheme');
    },

    setSelectValue(fieldName, selectionValue) {
      // sets lookupName so that we know fieldName in 'saveNamingScheme' above
      this.set('lookupName', fieldName);
      // this just sets hostNamingScheme on the modal component
      this.set(fieldName, selectionValue);
    }
  }
});
