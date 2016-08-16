import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.modelFor('deployment-new').get('lifecycle_environment');
  },

  setupController(controller, model) {
    controller.set('model', model);
    var lifecycleEnvironments = this.store.query('lifecycle-environment', {organization_id: 1});
    lifecycleEnvironments.then(function(results){
      controller.set('lifecycleEnvironments', results);
    });
  },

  deactivate() {
    this.get('controller').set('showAlertMessage', false);
  }

});
