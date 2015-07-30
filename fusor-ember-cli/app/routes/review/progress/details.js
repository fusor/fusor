import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel: function() {
    if (Ember.isBlank(this.modelFor('review.progress.overview'))) {
      this.transitionTo('review.progress.overview');
    }
  },

  model: function () {
    return this.modelFor('review.progress.overview');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('isLoadingMoreTasks', true);

    var manageContentTaskUuid = model.manageContentTask.get('id');
    console.log(manageContentTaskUuid);
    return this.store.find('foreman-task', {search: "parent_task_id=" + manageContentTaskUuid}).then(function(synctasks) {
          controller.set('synctasks', synctasks);
          return controller.set('isLoadingMoreTasks', false);
    });
  },

      // var deployment = this.modelFor('deployment');
      // var deployTaskPromise = this.store.find('foreman-task', deployment.get('foreman_task_uuid'));
      // var subtasksOfDeployPromise = this.store.find('foreman-task', {search: "parent_task_id = " + deployment.get('foreman_task_uuid')});
      // var self = this;

      // return Ember.RSVP.Promise.all([deployTaskPromise, subtasksOfDeployPromise]).then(function(results) {
      //   var deployTask = results[0];
      //   var subtasksOfDeploy = results[1];
      //   var manageContentTask = subtasksOfDeploy.findBy('humanized_name', 'Manage Content');
      //   var rhevTask          = subtasksOfDeploy.findBy('humanized_name', 'Deploy Red Hat Enterprise Virtualization');
      //   var cfmeTask          = subtasksOfDeploy.findBy('humanized_name', 'Deploy CloudForms Management Engine');

      //   var manageContentTaskUuid = manageContentTask.get('id');
      //   var subtasksOfManageContentPromise = self.store.find('foreman-task', {search: "parent_task_id = " + manageContentTaskUuid});

      //   return subtasksOfManageContentPromise.then(function(synctasks) {

      //       return Ember.RSVP.hash({
      //          deployTask: deployTask,
      //          manageContentTask: manageContentTask,
      //          rhevTask: rhevTask,
      //          cfmeTask: cfmeTask,
      //          synctask0: synctasks.objectAt(0),
      //          synctask1: synctasks.objectAt(1),
      //          synctask2: synctasks.objectAt(2),
      //          synctask3: synctasks.objectAt(3),
      //          synctask4: synctasks.objectAt(4),
      //          synctask5: synctasks.objectAt(5),
      //          synctask6: synctasks.objectAt(6),
      //          synctask7: synctasks.objectAt(7),
      //          synctask7: synctasks.objectAt(8),
      //       });

      //   });
      // });
});
