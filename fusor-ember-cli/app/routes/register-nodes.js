import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('showAlertMessage', false);
    var self = this;

    var introspection_tasks = this.modelFor('deployment').get('introspection_tasks');
    var arrayTasks = Ember.A();

    introspection_tasks.forEach(function(node, i) {
      if (node.get('task_id') && node.get('poll')) {
          self.store.findRecord('foreman-task', node.get('task_id'), {reload: true}).then(function(result) {
              arrayTasks.addObject(result);
          });
      }
    });

    controller.set('arrayTasks', arrayTasks);

    var deploymentId = this.modelFor('deployment').get('id');
    this.store.query('image', {deployment_id: deploymentId}).then(function(results) {
      var bmDeployKernelImage = results.findBy('name', 'bm-deploy-kernel');
      var bmDeployRamdiskImage = results.findBy('name', 'bm-deploy-ramdisk');
      controller.set('bmDeployKernelImage', bmDeployKernelImage);
      controller.set('bmDeployRamdiskImage', bmDeployRamdiskImage);
    });

    controller.stopPolling();
    controller.startPolling();
  },

  deactivate() {
    return this.get('controller').stopPolling();
  },

  actions: {
    refreshModelOnOverviewRoute() {
      let taskPromises = [];
      let introspection_tasks = this.modelFor('deployment')
        .get('introspection_tasks');

      introspection_tasks.forEach((node) => {
        let nodeTaskId = node.get('task_id');
        if (nodeTaskId && node.get('poll')) {
          taskPromises.push(this.store.findRecord(
            'foreman-task', nodeTaskId, { reload: true }));
        }
      });

      Ember.RSVP.all(taskPromises).then((resolvedTasks) => {
        if(taskPromises.length === 0) {
          this.deactivate();
        }
        this.get('controller').set('arrayTasks', resolvedTasks);
      });
    }
  }

});
