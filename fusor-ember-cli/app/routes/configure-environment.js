import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.modelFor('deployment').get('lifecycle_environment');
  },

  setupController(controller, model) {
    controller.set('model', model);
    var self = this;
    var organization = this.modelFor('deployment').get('organization');
    var lifecycleEnvironments = this.store.query('lifecycle-environment', {organization_id: organization.get('id')});
    lifecycleEnvironments.then(function(results){
      controller.set('lifecycleEnvironments', results);
      // nullify environment if organization has no environments
      if (results.get('length') === 0) {
        return controller.set('selectedEnvironment', null);
      } else {
        return controller.set('selectedEnvironment', model);
      }
    });
  },

  deactivate() {
    this.get('controller').set('showAlertMessage', false);
    return this.send('saveDeployment', null);
  }

});
