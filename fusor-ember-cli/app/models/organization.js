import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  title: DS.attr('string'),
  label: DS.attr('string'),
  description: DS.attr('string')
//  lifecycle_environments: DS.hasMany('lifecycle-environment', { async: true }),
//  subnets: DS.hasMany('subnet', { async: true })
});
