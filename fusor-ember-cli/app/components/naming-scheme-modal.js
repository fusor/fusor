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

  actions: {
    saveNamingScheme() {
        this.set('openModal', false);
        return this.sendAction('saveNamingScheme');
    },

    cancelNamingScheme() {
        this.set('openModal', false);
        return this.sendAction('cancelNamingScheme');
    }

  }
});
