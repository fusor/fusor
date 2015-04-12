import Ember from 'ember';
import DeploymentRouteMixin from "../mixins/deployment-route-mixin";

export default Ember.Route.extend(DeploymentRouteMixin, {

  model: function() {
    return this.store.createRecord('deployment');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('satelliteTabRouteName', 'deployment-new.satellite.index');
    controller.set('organizationTabRouteName', 'deployment-new.satellite.configure-organization');
    controller.set('lifecycleEnvironmentTabRouteName', 'deployment-new.satellite.configure-environment');
  },

  // rollback if new deployment not saved
  // TODO modal confirm/cancel
  deactivate: function() {
    var deployment = this.modelFor('deployment-new');
    if (deployment.get('isNew')) {
      return deployment.rollback();
    }
  }

});
