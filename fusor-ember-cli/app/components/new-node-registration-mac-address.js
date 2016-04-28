import Ember from 'ember';

export default Ember.Component.extend({
  label: Ember.computed('index', function() {
    return this.get('index') === 0 ? 'MAC Address' : '';
  }),

  cssId: Ember.computed('index', function() {
    return `newNodeManualMacAddressAddInput${this.get('index')}`;
  })
});
