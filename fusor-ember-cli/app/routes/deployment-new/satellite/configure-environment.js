import Ember from 'ember';
import DeploymentNewSatelliteRouteMixin from "../../../mixins/deployment-new-satellite-route-mixin";

export default Ember.Route.extend(DeploymentNewSatelliteRouteMixin, {

  model: function () {
    return this.modelFor('deployment-new').get('lifecycle_environment');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    // hardcode org id as 1 for develop openstack branch
    var lifecycleEnvironments = this.store.find('lifecycle-environment', {organization_id: 1});
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

});
