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
  },

  matchesAddress(addressStr, ports) {
    if (Ember.isEmpty(addressStr)) {
      return false;
    }

    let nodeAddress =  this.getMacAddress(ports);
    if (Ember.isEmpty(nodeAddress)) {
      return false;
    }

    return addressStr.toLowerCase().replace(/\W/g, '') === nodeAddress.toLowerCase().replace(/\W/g, '');
  },

  matchesProfile(profile) {
    let nodeMemory = this.get('properties.memory_mb');
    let nodeCPUs = this.get('properties.cpus');
    let workerDisk = this.get('properties.local_gb');
    let nodeCPUArch = this.get('properties.cpu_arch');
    let profileMemory = profile.get('ram');
    let profileCPUs = profile.get('vcpus');
    let profileDisk = profile.get('disk');
    let profileCPUArch = profile.get('extra_specs.cpu_arch');

    return nodeMemory == profileMemory &&
      nodeCPUs == profileCPUs &&
      workerDisk == profileDisk &&
      nodeCPUArch == profileCPUArch;
  }
});


