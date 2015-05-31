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
      // nullify environment if organization has no environments
      if (results.get('length') === 0) {
        return controller.set('selectedEnvironment', null);
      // default to Library if it is only env that exists
      } else if (results.get('length') === 1) {
        return controller.set('selectedEnvironment', results.get('firstObject'));
      }
    });
  },

  deactivate: function() {
    return this.send('saveDeployment', null);
  }

});
