import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  mac: DS.attr('string'),
  subnet_id: DS.attr('string'),
  subnet_name: DS.attr('string'),
  organization_id: DS.attr('string'),
  organization_name: DS.attr('string'),
  location_id: DS.attr('string'),
  location_name: DS.attr('string'),
  memory: DS.attr('string'),
  disk_count: DS.attr('string'),
  disks_size: DS.attr('string'),
  cpus: DS.attr('string'),
  isSelectedAsHypervisor: DS.attr('boolean', {defaultValue: false}),
  isSelectedAsEngine: DS.attr('boolean', {defaultValue: false})
});
