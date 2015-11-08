import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
      var deploymentId = this.modelFor('deployment').get('id');
      return Ember.RSVP.hash({
          nodes: this.store.query('node', {deployment_id: deploymentId}),
          profiles: this.store.query('flavor', {deployment_id: deploymentId})
      });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('showAlertMessage', false);
    var self = this;

    var introspection_tasks = this.modelFor('deployment').get('introspection_tasks');
    var arrayTasks = Ember.A();

    introspection_tasks.forEach(function(node, i) {
      if (node.get('task_id')) {
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

  deactivate: function() {
    return this.get('controller').stopPolling();
  },

  actions: {
    refreshModelOnOverviewRoute: function(){
        console.log('refreshing introspection progress bar tasks');
        var self = this;
        var controller = this.get('controller');

        var introspection_tasks = this.modelFor('deployment').get('introspection_tasks');
        var arrayTasks = Ember.A();

        introspection_tasks.forEach(function(node, i) {
          if (node.get('task_id')) {
              self.store.findRecord('foreman-task', node.get('task_id'), {reload: true}).then(function(result) {
                  arrayTasks.addObject(result);
              });
          }
        });

        controller.set('arrayTasks', arrayTasks);

    }
  }

});
