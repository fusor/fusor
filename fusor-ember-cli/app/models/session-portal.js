import DS from 'ember-data';

export default DS.Model.extend({
  identification: DS.attr('string'),
  ownerKey: DS.attr('string'),
  consumerUUID: DS.attr('string'),
  isAuthenticated: DS.attr('boolean')
});
