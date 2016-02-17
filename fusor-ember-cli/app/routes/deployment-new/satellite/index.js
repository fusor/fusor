import Ember from 'ember';
import DeploymentNewSatelliteRouteMixin from "../../../mixins/deployment-new-satellite-route-mixin";

export default Ember.Route.extend(DeploymentNewSatelliteRouteMixin, {

  deactivate() {
    let deploymentName = this.get('controller.model.name');
    if (Ember.isPresent(deploymentName)) {
      this.set('controller.model.name', deploymentName.trim());
    }
  }
});
