import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  value: DS.attr('string'),
  description: DS.attr('string'),
  category: DS.attr('string'),
  settings_type: DS.attr('string'),
  default: DS.attr('string'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date')
});
