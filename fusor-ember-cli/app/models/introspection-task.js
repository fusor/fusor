import DS from 'ember-data';

export default DS.Model.extend({
  task_id: DS.attr('string'),
  deployment: DS.belongsTo('deployment', {async: true}),
  node_uuid: DS.attr('string'),
  mac_address: DS.attr('string'),
  poll: DS.attr('boolean', {defaultValue: true})

});
