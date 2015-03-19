import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  organization: DS.belongsTo('organization', {async: true}),
  lifecycle_environment: DS.belongsTo('lifecycle-environment', {async: true}),

  deploy_rhev: DS.attr('boolean'),
  deploy_cfme: DS.attr('boolean'),
  deploy_openstack: DS.attr('boolean'),

  rhev_is_self_hosted: DS.attr('boolean'),

  // one-to-one: One deployment has one rhev engine host. One host has one deployment
  rhev_engine_host: DS.belongsTo('discovered-host', {inverse: 'rhev_deployments', async: true}), //TODO error if I added
  discovered_host: DS.belongsTo('discovered-host', {inverse: 'deployment', async: true}), //TODO error if I added
  discovered_hosts: DS.hasMany('discovered-host', {inverse: 'deployments', async: true}), //TODO error if I added

  // rhev_hypervisors: DS.hasMany('discovered-host', {async: true}),

  rhev_engine_hostname: DS.attr('string'),

  rhev_engine_admin_password: DS.attr('string'),
  rhev_database_name: DS.attr('string'),
  rhev_cluster_name: DS.attr('string'),
  rhev_storage_name: DS.attr('string'),
  rhev_storage_type: DS.attr('string'),
  rhev_storage_address: DS.attr('string'),
  rhev_cpu_type: DS.attr('string'),
  rhev_share_path: DS.attr('string'),

  cfme_install_loc: DS.attr('string'),

  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),
});
