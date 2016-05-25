import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({

  contract_number: DS.attr('string'),
  product_name: DS.attr('string'),
  quantity_to_add: DS.attr('number'),
  quantity_attached: DS.attr('number'),
  start_date: DS.attr('date'),
  end_date: DS.attr('date'),
  total_quantity: DS.attr('number'),
  source: DS.attr('string'),
  deployment: DS.belongsTo('deployment', {inverse: 'subscriptions', async: true}),

  qtySumAttached: Ember.computed('quantity_to_add', 'quantity_attached', function() {
    return (parseInt(this.get('quantity_to_add')) +
            parseInt(this.get('quantity_attached')));
  })

});
