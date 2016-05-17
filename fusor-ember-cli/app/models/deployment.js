import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  label: DS.attr('string'),
  description: DS.attr('string'),
  organization: DS.belongsTo('organization', {async: true}),
  lifecycle_environment: DS.belongsTo('lifecycle-environment', {async: true}),

  deploy_rhev: DS.attr('boolean'),
  deploy_cfme: DS.attr('boolean'),
  deploy_openstack: DS.attr('boolean'),
  deploy_openshift: DS.attr('boolean'),

  is_disconnected: DS.attr('boolean'),
  has_content_error: DS.attr('boolean'),
  rhev_is_self_hosted: DS.attr('boolean'),

  rhev_engine_admin_password: DS.attr('string'),
  rhev_data_center_name: DS.attr('string'),
  rhev_cluster_name: DS.attr('string'),
  rhev_storage_name: DS.attr('string'),
  rhev_storage_type: DS.attr('string'),
  rhev_storage_address: DS.attr('string'),
  rhev_cpu_type: DS.attr('string'),
  rhev_share_path: DS.attr('string'),

  cfme_install_loc: DS.attr('string'),

  rhev_root_password: DS.attr('string'),
  cfme_root_password: DS.attr('string'),
  cfme_admin_password: DS.attr('string'),
  cfme_db_password: DS.attr('string'),

  foreman_task_uuid: DS.attr('string'),
  upstream_consumer_uuid: DS.attr('string'),
  upstream_consumer_name: DS.attr('string'),

  rhev_export_domain_name: DS.attr('string'),
  rhev_export_domain_address: DS.attr('string'),
  rhev_export_domain_path: DS.attr('string'),

  hosted_storage_name: DS.attr('string'),
  hosted_storage_address: DS.attr('string'),
  hosted_storage_path: DS.attr('string'),

  rhev_local_storage_path: DS.attr('string'),

  host_naming_scheme: DS.attr('string'),
  custom_preprend_name: DS.attr('string'),
  enable_access_insights: DS.attr('boolean'),
  cfme_address: DS.attr('string'),
  cfme_hostname: DS.attr('string'),

  cdn_url: DS.attr('string'),
  manifest_file: DS.attr('string'),

  openshift_install_loc: DS.attr('string'),

  openshift_number_master_nodes: DS.attr('number'),
  openshift_number_worker_nodes: DS.attr('number'),

  numNodes: Ember.computed(
    'openshift_number_master_nodes',
    'openshift_number_worker_nodes',
    function() {
      return this.get('openshift_number_master_nodes') + this.get('openshift_number_worker_nodes');
    }
  ),

  openshift_storage_size: DS.attr('number'),
  openshift_username: DS.attr('string'),
  openshift_user_password: DS.attr('string'),
  openshift_root_password: DS.attr('string'),
  openshift_master_vcpu: DS.attr('number'),
  openshift_master_ram: DS.attr('number'),
  openshift_master_disk: DS.attr('number'),
  openshift_node_vcpu: DS.attr('number'),
  openshift_node_ram: DS.attr('number'),
  openshift_node_disk: DS.attr('number'),
  openshift_available_vcpu: DS.attr('number'),
  openshift_available_ram: DS.attr('number'),
  openshift_available_disk: DS.attr('number'),
  openshift_storage_type: DS.attr('string'),
  openshift_storage_name: DS.attr('string'),
  openshift_storage_host: DS.attr('string'),
  openshift_export_path: DS.attr('string'),
  openshift_subdomain_name: DS.attr('string'),

  openshift_hosts: DS.hasMany('openshift-host', {async: true}),
  openshift_master_hosts: Ember.computed('openshift_hosts', function() {
    const regexFilter = /ose-master\d+\./;
    return this.get('openshift_hosts')
      .filter(host => regexFilter.test(host.get('name')));
  }),

  openshift_worker_hosts: Ember.computed('openshift_hosts', function() {
    const regexFilter = /ose-node\d+\./;
    return this.get('openshift_hosts')
      .filter(host => regexFilter.test(host.get('name')));
  }),

  cloudforms_vcpu: DS.attr('number'),
  cloudforms_ram: DS.attr('number'),
  cloudforms_vm_disk_size: DS.attr('number'),
  cloudforms_db_disk_size: DS.attr('number'),

  cfmeDisk: Ember.computed(
    'cloudforms_vm_disk_size',
    'cloudforms_db_disk_size',
    function() {
      return this.get('cloudforms_vm_disk_size') + this.get('cloudforms_db_disk_size');
    }
  ),

  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  // has one Engine - discovered_host is an alias for rhev_engine_host_id
  discovered_host: DS.belongsTo('discovered-host', {async: true}),
  rhev_engine_host_id: DS.attr('number'),

  // has many Hypervisors
  discovered_hosts: DS.hasMany('discovered-host', {async: true}),

  // has many Subscriptions
  subscriptions: DS.hasMany('subscription', {inverse: 'deployment', async: true}),
  introspection_tasks: DS.hasMany('introspection-task', {async: true}),

  // has one foreman_task
  foreman_task: DS.belongsTo('foreman-task',  {async: true}),

  openstack_deployment: DS.belongsTo('openstack-deployment', {async: true}),

  // Ember Data doesn't have DS.attr('array') so I did this
  rhev_hypervisor_host_ids: Ember.computed('discovered_hosts', function() {
    var discovered_hosts = this.get('discovered_hosts');
    if (Ember.isPresent(discovered_hosts)) {
      return discovered_hosts.getEach('id');
    } else {
      return [];
    }
  }),

  // controller.deployment.isStarted returns false if refreshing child route,
  // so best to have it on model as well
  isStarted: Ember.computed('foreman_task_uuid', function() {
    return Ember.isPresent(this.get('foreman_task_uuid'));
  }),
  isNotStarted: Ember.computed.not('isStarted'),

  // also put these in model rather than controller so it is accessible
  progress: null,
  state: null,

  isComplete: Ember.computed('progress', function() {
    return this.get('progress') === '1';
  }),

  isInProgress: Ember.computed('isStarted', 'isComplete', function() {
    return this.get('isStarted') && !this.get('isComplete');
  }),

  setProgress: Ember.observer('foreman_task', 'foreman_task_uuid', function() {
    var self = this;
    if (this.get('foreman_task')) {
      this.get('foreman_task').then(function(result) {
        if (result) {
          self.set('progress', result.get('progress'));
          self.set('state', result.get('state'));
        }
      }.bind(this));
    }
  }),

  progressPercent: Ember.computed('progress', function() {
    if (this.get('progress')) {
      return (this.get('progress') * 100).toFixed(1) + '%';
    }
  })

});

