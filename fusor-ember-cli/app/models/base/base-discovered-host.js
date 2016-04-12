import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  ip: DS.attr('string'),
  mac: DS.attr('string'),
  memory: DS.attr('number'),
  disk_count: DS.attr('number'),
  disks_size: DS.attr('number'),
  cpus: DS.attr('number'),
  memory_human_size: DS.attr('string'),
  disks_human_size: DS.attr('string'),
  subnet_to_s: DS.attr('string'),
  is_virtual: DS.attr('boolean'),

  type: DS.attr('string'),
  is_managed: DS.attr('boolean'),
  is_discovered: DS.attr('boolean'),

  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  environment_name: DS.attr('string'),
  hostgroup_name: DS.attr('string'),
  compute_resource_name: DS.attr('string'),
  domain_name: DS.attr('string')
});
