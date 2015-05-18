import DS from 'ember-data';

export default DS.Model.extend({
  productName: DS.attr('string'),
  contractNumber: DS.attr('string'),
  type: DS.attr('string'),
  startDate: DS.attr('date'),
  endDate: DS.attr('date'),
  quantity: DS.attr('number'),
});
