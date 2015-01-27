import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  hostgroup: DS.attr('string'),
  mac: DS.attr('string'),
  domain: DS.attr('string'),
  subnet: DS.attr('string'),
  operatingsystem: DS.attr('string'),
  environment: DS.attr('string'),
  model: DS.attr('string'),
  location: DS.attr('string'),
  organization: DS.attr('string'),
  cpu: DS.attr('string'),
  memory: DS.attr('string'),
  vendor: DS.attr('string'),
  isSelectedAsHypervisor: DS.attr('boolean'),
  isSelectedAsEngine: DS.attr('boolean')
});
