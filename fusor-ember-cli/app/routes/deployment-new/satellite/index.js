import Ember from 'ember';
import DeploymentNewSatelliteRouteMixin from "../../../mixins/deployment-new-satellite-route-mixin";

export default Ember.Route.extend(DeploymentNewSatelliteRouteMixin, {

  setupController(controller, model) {
    controller.set('model', model);
    this.store.findRecord('organization', 1).then(function(result) {
      model.set('organization', result);
    });
  },

  deactivate() {
    let deploymentName = this.get('controller.model.name');
    if (Ember.isPresent(deploymentName)) {
      this.set('controller.model.name', deploymentName.trim());
    }
  }
});
