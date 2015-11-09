import Ember from 'ember';
import DeploymentRouteMixin from "../mixins/deployment-route-mixin";

export default Ember.Route.extend(DeploymentRouteMixin, {

  model() {
    return this.store.createRecord('deployment');
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('satelliteTabRouteName', 'deployment-new.satellite.index');
    controller.set('organizationTabRouteName', 'deployment-new.satellite.configure-organization');
    controller.set('lifecycleEnvironmentTabRouteName', 'deployment-new.satellite.configure-environment');
    controller.set('model.enable_access_insights', false);
    controller.set('model.rhev_cluster_name', 'Default');
    controller.set('model.rhev_storage_name', 'my_storage');
    controller.set('model.rhev_export_domain_name', 'my_export');
    controller.set('model.rhev_database_name', 'Default');
    this.controllerFor('application').set('isNewDeployment', true);
  },

  // rollback if new deployment not saved
  // TODO modal confirm/cancel
  deactivate() {
    var deployment = this.modelFor('deployment-new');
    if (deployment.get('isNew')) {
      return deployment.rollback();
    }
  }

});
