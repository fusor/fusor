import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  title: DS.attr('string'),
  parent_id: DS.attr('number'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),
  domain: DS.belongsTo('domain', {async: true})
});
