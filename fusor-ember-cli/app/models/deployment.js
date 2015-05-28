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

  rhev_engine_admin_password: DS.attr('string'),
  rhev_database_name: DS.attr('string'),
  rhev_cluster_name: DS.attr('string'),
  rhev_storage_name: DS.attr('string'),
  rhev_storage_type: DS.attr('string'),
  rhev_storage_address: DS.attr('string'),
  rhev_cpu_type: DS.attr('string'),
  rhev_share_path: DS.attr('string'),

  cfme_install_loc: DS.attr('string'),

  rhev_root_password: DS.attr('string'),
  cfme_root_password: DS.attr('string'),

  foreman_task_uuid: DS.attr('string'),
  upstream_consumer_uuid: DS.attr('string'),
  upstream_consumer_name: DS.attr('string'),

  rhev_export_domain_name: DS.attr('string'),
  rhev_export_domain_address: DS.attr('string'),
  rhev_export_domain_path: DS.attr('string'),

  rhev_local_storage_path: DS.attr('string'),
  rhev_gluster_node_name: DS.attr('string'),
  rhev_gluster_node_address: DS.attr('string'),
  rhev_gluster_ssh_port: DS.attr('string'),
  rhev_gluster_root_password: DS.attr('string'),

  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  useDefaultOrgViewForEnv: function() {
    return !!(this.get('discovered_host.id'));
  }.property('discovered_host'),

  // has one Engine
  discovered_host: DS.belongsTo('discovered-host', {inverse: 'deployment', async: true}),

  // has many Hypervisors
  discovered_hosts: DS.hasMany('discovered-host', {inverse: 'deployments', async: true}),

});


