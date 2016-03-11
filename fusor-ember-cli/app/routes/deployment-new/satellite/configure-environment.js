import Ember from 'ember';
import DeploymentNewSatelliteRouteMixin from "../../../mixins/deployment-new-satellite-route-mixin";

export default Ember.Route.extend(DeploymentNewSatelliteRouteMixin, {

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
