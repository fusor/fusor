import Ember from 'ember';

export default Ember.Route.extend({
  model() {
      var deploymentId = this.modelFor('deployment').get('id');
      return Ember.RSVP.hash({
          nodes: this.store.query('node', {deployment_id: deploymentId}),
          profiles: this.store.query('flavor', {deployment_id: deploymentId})
      });
  },

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
    refreshNodesAndFlavors() {
      // manually set manual rather than using this.get('model').reload() which looks at data store changes
      // since the nodes changes or db changes happened outside of ember-data.
      console.log('refreshing model.nodes and model.profiles');
      var deploymentId = this.modelFor('deployment').get('id');
      var self = this;
      Ember.RSVP.hash({nodes: this.store.find('node', {deployment_id: deploymentId}),
                       profiles: this.store.find('flavor', {deployment_id: deploymentId})
                     }).then(function(result) {
                         return self.get('controller').set('model', result);
                     });
    },

    refreshModelOnOverviewRoute() {
        console.log('refreshing introspection progress bar tasks');
        var self = this;
        var controller = this.get('controller');

        var introspection_tasks = this.modelFor('deployment').get('introspection_tasks');
        var arrayTasks = Ember.A();

        var continuePolling = false;
        introspection_tasks.forEach(function(node, i) {
          if (node.get('task_id') && node.get('poll')) {
              self.store.findRecord('foreman-task', node.get('task_id'), {reload: true}).then(function(result) {
                  arrayTasks.addObject(result);
                  if (!result.get('pending')) {
                      node.set('poll', false);
                      self.send('refreshNodesAndFlavors');
                  }
              });
              // There is at least one task that still needs refreshing
              continuePolling = true;
          }
        });

        controller.set('arrayTasks', arrayTasks);
        if (!continuePolling) {
            self.deactivate();
        }

    }
  }

});
