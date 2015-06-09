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
    controller.set('enable_access_insights', true);
    controller.set('rhev_cluster_name', 'Default');
    controller.set('rhev_storage_name', 'my_storage');
    controller.set('rhev_export_domain_name', 'my_export');
    controller.set('rhev_database_name', 'Default');
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
