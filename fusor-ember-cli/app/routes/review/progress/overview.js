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

        var manageContentTaskUuid = manageContentTask.get('id');
        var subtasksOfManageContentPromise = self.store.find('foreman-task', {search: "parent_task_id = " + manageContentTaskUuid});

        return Ember.RSVP.hash({
           deployTask: deployTask,
           manageContentTask: manageContentTask,
           rhevTask: rhevTask,
           cfmeTask: cfmeTask
        });

      });
  },

  actions: {
    refreshModel: function(){
      console.log('refreshModelOnRoute');
      return this.refresh();
    }
  }
});
