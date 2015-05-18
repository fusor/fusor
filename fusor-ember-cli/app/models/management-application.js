import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  type: DS.attr('string'),
  entitlementCount: DS.attr('number'),
  uuid: DS.attr('string')
});
