import Ember from 'ember';

export default Ember.Component.extend({

  hostNumber: Ember.computed('index', 'indexOffset', function() {
    let index = this.get('index');
    let indexOffset = this.get('indexOffset');
    return indexOffset ? index + indexOffset + 1: index + 1;
  }),

  deselected: Ember.computed.not('host.selected'),

  deselectedTextClass: Ember.computed('deselected', function() {
    return this.get('deselected') ? 'new-node-deselected-text' : '';
  }),

  selectId: Ember.computed('hostNumber', function () {
    return `autoDetectNodeMacAddressSelect${this.get('hostNumber')}`;
  }),

  multipleMacAddresses: Ember.computed('host.macAddresses', function () {
    return this.get('host.macAddresses.length') > 1;
  })
});
