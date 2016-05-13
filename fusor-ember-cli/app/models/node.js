import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  uuid: DS.attr('string'),
  driver: DS.attr('string'),
  provision_state: DS.attr('string'),
  driver_info: DS.attr(),
  properties: DS.attr(),
  address: DS.attr('string'),
  power_state: DS.attr('string'),
  last_error: DS.attr('string'),

  ready: Ember.computed('properties.cpus', 'properties.memory_mb', 'properties.local_gb', function() {
    return Ember.isPresent(this.get('properties.cpus')) &&
          Ember.isPresent(this.get('properties.memory_mb')) &&
          Ember.isPresent(this.get('properties.local_gb'));
  }),

  getMacAddress(ports) {
    let port = ports ? ports.findBy('node_uuid', this.get('id')) : null;
    return port ? port.address : null;
  },

  getIntrospectionTask(introspectionTasks) {
    return introspectionTasks ? introspectionTasks.findBy('node_uuid', this.get('id')) : null;
  },

  getForemanTask(introspectionTasks, foremanTasks) {
    if (!introspectionTasks || !foremanTasks) {
      return null;
    }

    let introspectionTask = this.getIntrospectionTask(introspectionTasks);
    return introspectionTask ? foremanTasks.findBy('id', introspectionTask.get('task_id')) : null;
  }
});


