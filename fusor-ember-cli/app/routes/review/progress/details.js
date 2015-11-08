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

    if (model.manageContentTask) {
        var manageContentTaskUuid = model.manageContentTask.get('id');
        console.log(manageContentTaskUuid);
        return this.store.query('foreman-task', {search: "parent_task_id=" + manageContentTaskUuid}).then(function(synctasks) {
              controller.set('synctasks', synctasks);
              return controller.set('isLoadingMoreTasks', false);
        });
    } else {
        return controller.set('isLoadingMoreTasks', false);
    }
  }

});
