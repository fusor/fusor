import Ember from 'ember';

export default Ember.ArrayController.extend({

  showEntitlements: true,
  arrayQuantities: Ember.computed.mapBy('model', 'quantity'),
  totalQuantity: Ember.computed.sum('arrayQuantities'),

});
