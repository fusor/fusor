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
  memory: DS.attr('number'),
  disk_count: DS.attr('number'),
  disks_size: DS.attr('number'),
  cpus: DS.attr('number'),
  memory_human_size: DS.attr('string'),
  disks_human_size: DS.attr('string'),
  subnet_to_s: DS.attr('string'),
  is_virtual: DS.attr('boolean'),

  // relationship to Engine
  deployment: DS.belongsTo('deployment', {inverse: 'discovered_host', async: true}),

  // relationship to Hypervisors
  deployments: DS.hasMany('deployment', {inverse: 'discovered_hosts', async: true}),

  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

});
