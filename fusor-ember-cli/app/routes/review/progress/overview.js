import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
      var deployment = this.modelFor('deployment');
      var deployTaskPromise = this.store.query('foreman-task', {search: "id = " + deployment.get('foreman_task_uuid')});
      var subtasksOfDeployPromise = this.store.query('foreman-task', {search: "parent_task_id = " + deployment.get('foreman_task_uuid')});
      var self = this;
      return Ember.RSVP.Promise.all([deployTaskPromise, subtasksOfDeployPromise]).then(function(results) {
        var deployTask = results[0].get('firstObject');
        var subtasksOfDeploy = results[1];
        var manageContentTask = subtasksOfDeploy.findBy('humanized_name', 'Manage Content');
        var rhevTask          = subtasksOfDeploy.findBy('humanized_name', 'Deploy Red Hat Enterprise Virtualization');
        var openstackTask     = subtasksOfDeploy.findBy('humanized_name', 'Deploy Red Hat OpenStack Platform overcloud');
        var cfmeTask          = subtasksOfDeploy.findBy('humanized_name', 'Deploy CloudForms Management Engine');

        return Ember.RSVP.hash({
           deployTask: deployTask,
           manageContentTask: manageContentTask,
           rhevTask: rhevTask,
           openstackTask: openstackTask,
           cfmeTask: cfmeTask,
        });

      });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('deployTask', model.deployTask);
    controller.set('manageContentTask', model.manageContentTask);
    controller.set('rhevTask', model.rhevTask);
    controller.set('openstackTask', model.openstackTask);
    controller.set('cfmeTask', model.cfmeTask);
    controller.stopPolling();
    controller.startPolling();
  },

  activate: function() {
    window.scrollTo(0,0);
  },

  deactivate: function() {
    this.get('controller').stopPolling();
  },

  actions: {
    refreshModelOnOverviewRoute: function(){
      return this.refresh();
    }
  }

});
