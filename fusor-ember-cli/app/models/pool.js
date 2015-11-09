import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({

  type: DS.attr('string'),
  subscriptionId: DS.attr('string'),
  activeSubscription: DS.attr('boolean'),
  contractNumber: DS.attr('string'),
  accountNumber: DS.attr('string'),
  consumed: DS.attr('number'),
  exported: DS.attr('number'),
  productName: DS.attr('string'),

  quantity: DS.attr('number'),
  startDate: DS.attr('date'),
  endDate: DS.attr('date'),
  href: DS.attr('string'),
  created: DS.attr('date'),
  updated: DS.attr('date'),

  qtyAvailable: Ember.computed('quantity', 'consumed', function() {
    return this.get('quantity') - this.get('consumed');
  }),

  qtyAvailableOfTotal: Ember.computed('qtyAvailable', 'quantity', function() {
    return this.get('qtyAvailable') + ' of ' + this.get('quantity');
  })

});

