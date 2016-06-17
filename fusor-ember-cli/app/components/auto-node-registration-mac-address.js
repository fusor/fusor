import Ember from 'ember';

export default Ember.Component.extend({

  hostNumber: Ember.computed('index', 'indexOffset', function() {
    let index = this.get('index');
    let indexOffset = this.get('indexOffset');
    return indexOffset ? index + indexOffset + 1: index + 1;
  }),

  deselected: Ember.computed.not('host.selected'),

  readyStatusClass: Ember.computed('host.selected', 'host.value', function () {
    if (!this.get('host.selected')) {
      return 'new-node-detect-deselected';
    }

    if (Ember.isPresent(this.get('host.value'))) {
      return 'new-node-detect-ready';
    }

    return 'new-node-detect-invalid';
  }),

  isInvalid: Ember.computed('host.selected', 'host.value', function() {
    return this.get('host.selected') && !Ember.isPresent(this.get('host.value'));
  }),

  selectId: Ember.computed('hostNumber', function () {
    return `autoDetectNodeMacAddressSelect${this.get('hostNumber')}`;
  }),

  multipleMacAddresses: Ember.computed('host.macAddresses', function () {
    return this.get('host.macAddresses.length') > 1;
  })
});
