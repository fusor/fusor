import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  label: DS.attr('string'),
  description: DS.attr('string'),
  library: DS.attr('boolean'),
  prior: DS.attr('number'),
  prior_id: DS.attr('number'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),
  organization: DS.belongsTo('organization', {async: true})
});
