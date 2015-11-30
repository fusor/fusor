import DS from 'ember-data';

export default DS.Model.extend({

  contract_number: DS.attr('string'),
  product_name: DS.attr('string'),
  quantity_attached: DS.attr('number'),
  start_date: DS.attr('date'),
  end_date: DS.attr('date'),
  total_quantity: DS.attr('number'),
  source: DS.attr('string'),
  deployment: DS.belongsTo('deployment', {inverse: 'subscriptions', async: true})

});
