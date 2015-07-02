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

  qtyAvailable: function() {
    return this.get('quantity') - this.get('consumed');
  }.property('quantity', 'consumed'),

  qtyAvailableOfTotal: function() {
    return this.get('qtyAvailable') + ' of ' + this.get('quantity');
  }.property('qtyAvailable', 'quantity')

});

