import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  label: DS.attr('string'),
  description: DS.attr('string'),
  prior: DS.attr('string')
//  organization: DS.belongsTo('organization')
});
