import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
      var deployment = this.modelFor('deployment');
      var deployTaskPromise = this.store.find('foreman-task', deployment.get('foreman_task_uuid'));
      var subtasksOfDeployPromise = this.store.find('foreman-task', {search: "parent_task_id = " + deployment.get('foreman_task_uuid')});
      var self = this;

      return Ember.RSVP.Promise.all([deployTaskPromise, subtasksOfDeployPromise]).then(function(results) {
        var deployTask = results[0];
        var subtasksOfDeploy = results[1];
        var manageContentTask = subtasksOfDeploy.findBy('humanized_name', 'Manage Content');
        var rhevTask          = subtasksOfDeploy.findBy('humanized_name', 'Deploy Red Hat Enterprise Virtualization');
        var cfmeTask          = subtasksOfDeploy.findBy('humanized_name', 'Deploy CloudForms Management Engine');

        return Ember.RSVP.hash({
           deployTask: deployTask,
           manageContentTask: manageContentTask,
           rhevTask: rhevTask,
           cfmeTask: cfmeTask
        });

      });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    //alert("startPolling in setupController");
    controller.stopPolling();
    controller.startPolling();
  },

  deactivate: function() {
    //alert("stopPolling in deactivate");
    this.get('controller').stopPolling();
  },

  actions: {
    refreshModelOnOverviewRoute: function(){
      console.log('refreshModelOnOverviewRoute');
      return this.refresh();
    }
  }

});
