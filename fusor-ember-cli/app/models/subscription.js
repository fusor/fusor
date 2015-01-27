import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  contract_number: DS.attr('string'),
  available: DS.attr('string'),
  subscription_type: DS.attr('string'),
  start_date: DS.attr('date'),
  end_date: DS.attr('date'),
  quantity: DS.attr('number')
});
