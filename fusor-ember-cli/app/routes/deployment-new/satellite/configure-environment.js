import Ember from 'ember';
import DeploymentNewSatelliteRouteMixin from "../../../mixins/deployment-new-satellite-route-mixin";

export default Ember.Route.extend(DeploymentNewSatelliteRouteMixin, {

  model: function () {
    return this.modelFor('deployment-new').get('lifecycle_environment');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    var self = this;
    var organization = this.modelFor('deployment-new').get('organization');
    var lifecycleEnvironments = this.store.find('lifecycle-environment', {organization_id: organization.get('id')});
    lifecycleEnvironments.then(function(results){
      controller.set('lifecycleEnvironments', results);
      // nullify environment if organization has no environments
      if (results.get('length') === 0) {
        return controller.set('selectedEnvironment', null);
      // default to Library if it is only env that exists
      } else if (results.get('length') === 1) {
        var libraryEnv = results.get('firstObject');
        self.controllerFor('deployment-new').set('lifecycle_environment', libraryEnv);
        return controller.set('selectedEnvironment', libraryEnv);
      } else {
        return controller.set('useDefaultOrgViewForEnv', false);
      }
    });
  },

  deactivate: function() {
    this.get('controller').set('showAlertMessage', false);
  }

});
