import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    uuid: DS.attr('string'),
    driver: DS.attr('string'),
    provision_state: DS.attr('string'),
    driver_info: DS.attr(),
    properties: DS.attr(),
    address: DS.attr('string'),
    last_error: DS.attr('string'),

    ready: Ember.computed('properties.cpu', 'properties.memory_mb', 'properties.local_gb', function() {
        return Ember.isPresent(this.get('node.properties.cpu')) &&
          Ember.isPresent(this.get('node.properties.memory_mb')) &&
          Ember.isPresent(this.get('node.properties.local_gb'));
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


