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

  rhev_deployments: DS.hasMany('deployment', {inverse: 'rhev_engine_host', async: true}),
  deployment: DS.belongsTo('deployment', {inverse: 'discovered_host', async: true}),
  deployments: DS.belongsTo('deployment', {inverse: 'discovered_hosts', async: true}),

  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

});
