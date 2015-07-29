import Ember from 'ember';

export default Ember.Route.extend({

  // refactor to mixin
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

        var manageContentTaskUuid = manageContentTask.get('id')
        var subtasksOfManageContentPromise = self.store.find('foreman-task', {search: "parent_task_id = " + manageContentTaskUuid});

        // TODO - refactor this to be more efficent of only one subtasksOfManageContentPromise.then
        return Ember.RSVP.hash({
           deployTask: deployTask,
           manageContentTask: manageContentTask,
           rhevTask: rhevTask,
           cfmeTask: cfmeTask,
           synctask0: subtasksOfManageContentPromise.then(function(synctasks) { return synctasks.objectAt(0) }),
           synctask1: subtasksOfManageContentPromise.then(function(synctasks) { return synctasks.objectAt(1) }),
           synctask2: subtasksOfManageContentPromise.then(function(synctasks) { return synctasks.objectAt(2) }),
           synctask3: subtasksOfManageContentPromise.then(function(synctasks) { return synctasks.objectAt(3) }),
           synctask4: subtasksOfManageContentPromise.then(function(synctasks) { return synctasks.objectAt(4) }),
           synctask5: subtasksOfManageContentPromise.then(function(synctasks) { return synctasks.objectAt(5) }),
           synctask6: subtasksOfManageContentPromise.then(function(synctasks) { return synctasks.objectAt(6) }),
           synctask7: subtasksOfManageContentPromise.then(function(synctasks) { return synctasks.objectAt(7) }),
           synctask8: subtasksOfManageContentPromise.then(function(synctasks) { return synctasks.objectAt(8) }),
         });
      });
  },

});
