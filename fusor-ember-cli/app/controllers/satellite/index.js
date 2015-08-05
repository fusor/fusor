import Ember from 'ember';
import SatelliteControllerMixin from "../../mixins/satellite-controller-mixin";

export default Ember.Controller.extend(SatelliteControllerMixin, {

  needs: ['satellite', 'deployment', 'application'],

  name: Ember.computed.alias("controllers.deployment.name"),
  description: Ember.computed.alias("controllers.deployment.description"),
  isStarted: Ember.computed.alias("controllers.deployment.isStarted"),

  organizationTabRouteName: Ember.computed.alias("controllers.deployment.organizationTabRouteName"),

  disableNextOnDeploymentName: Ember.computed.alias("controllers.deployment.disableNextOnDeploymentName"),

  idSatName: 'deployment_sat_name',
  idSatDesc: 'deployment_sat_desc',

  backRouteNameOnSatIndex: 'deployment.start',

  deploymentNames: Ember.computed.alias("controllers.application.deploymentNames")

});
