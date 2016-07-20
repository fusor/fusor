import Ember from 'ember';

export default Ember.Component.extend({

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
    return this.get('customPreprendName').trim();
  }),

  actions: {
    saveNamingScheme() {
      this.set('openModal', false);
      this.sendAction('saveNamingScheme');
    },

    cancelNamingScheme() {
      this.set('openModal', false);
      this.sendAction('cancelNamingScheme');
    },
    setSelectValue(fieldName, selectionValue) {
      // this just sets hostNamingScheme on the modal component
      this.set(fieldName, selectionValue);
      // this triggers the action to update hostNamingScheme on the deployment modal
      this.sendAction('setSelectValue', fieldName, selectionValue);
    }

  }
});
