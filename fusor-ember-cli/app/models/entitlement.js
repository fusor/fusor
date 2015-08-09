import DS from 'ember-data';

export default DS.Model.extend({

  //pool node attributes
  poolId: DS.attr('string'),
  poolType: DS.attr('string'),
  poolQuantity: DS.attr('number'),
  subscriptionId: DS.attr('string'),
  activeSubscription: DS.attr('boolean'),
  contractNumber: DS.attr('string'),
  accountNumber: DS.attr('string'),
  consumed: DS.attr('number'),
  exported: DS.attr('number'),
  productName: DS.attr('string'),

  //attributes not returned in 'pool' node
  quantity: DS.attr('number'),
  startDate: DS.attr('date'),
  endDate: DS.attr('date'),
  href: DS.attr('string'),
  created: DS.attr('date'),
  updated: DS.attr('date')

});
