import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  subnets: DS.hasMany('subnet', { async: true })
});
