import DS from 'ember-data';

export default DS.Model.extend({
  task_id: DS.attr('string'),
  deployment: DS.belongsTo('deployment', {async: true})

});
