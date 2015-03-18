import Ember from 'ember';

export default Ember.Route.extend({

  model: function () {
    return this.modelFor('deployment').get('lifecycle_environment');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    var organization = this.modelFor('deployment').get('organization');
    var lifecycleEnvironments = this.store.find('lifecycle-environment', {organization_id: organization.get('id')});
    lifecycleEnvironments.then(function(results){
      controller.set('lifecycleEnvironments', results);
      // nullify environment if organization has no environments, it gives validation error if trying to save with no environment
      if (results.get('length') === 0) {
        return controller.set('model', null);
      }
    });
  },

  deactivate: function() {
    return this.send('saveDeployment', null);
  }

});
