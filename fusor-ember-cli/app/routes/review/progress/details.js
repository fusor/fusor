import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel: function() {
    if (Ember.isBlank(this.modelFor('review.progress.overview'))) {
      this.transitionTo('review.progress.overview');
    }
  },

  model: function () {
    /* from Develop Branch for OpenStack?
    //return Ember.$.getJSON('/api/v21/foreman_tasks');
    //var uud = this.modelFor()
    // return this.store.find('foreman-task', {uuid: 'db25a76f-e344-48ba-ac77-f29303586dbe'});
    var foreman_task_uuid = this.modelFor('deployment').get('foreman_task_uuid');
    return
    return Ember.RSVP.hash({
        //foremanTask: this.store.find('foreman-task', foreman_task_uuid ),
        openstackPlan: this.store.find('deployment-plan', 'overcloud'),
        openstackNodes: this.store.find('node'),
    });
    */
    return this.modelFor('review.progress.overview');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('isLoadingMoreTasks', true);

    if (model.manageContentTask) {
        var manageContentTaskUuid = model.manageContentTask.get('id');
        console.log(manageContentTaskUuid);
        return this.store.find('foreman-task', {search: "parent_task_id=" + manageContentTaskUuid}).then(function(synctasks) {
              controller.set('synctasks', synctasks);
              return controller.set('isLoadingMoreTasks', false);
        });
    } else {
        return controller.set('isLoadingMoreTasks', false);
    }
  }

});
