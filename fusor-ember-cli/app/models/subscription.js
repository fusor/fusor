import DS from 'ember-data';

export default DS.Model.extend({

  contract_number: DS.attr('string'),
  product_name: DS.attr('string'),
  quantity_attached: DS.attr('number'),
  deployment: DS.belongsTo('deployment', {inverse: 'subscriptions', async: true})

});
