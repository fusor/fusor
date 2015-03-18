import Ember from 'ember';
import SatelliteControllerMixin from "../mixins/satellite-controller-mixin";

export default Ember.Controller.extend(SatelliteControllerMixin, {

  needs: ['deployment'],

  satelliteTabRouteName: Ember.computed.alias("controllers.deployment.satelliteTabRouteName"),
  organizationTabRouteName: Ember.computed.alias("controllers.deployment.organizationTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("controllers.deployment.lifecycleEnvironmentTabRouteName"),

  disableTabDeploymentName: Ember.computed.alias("controllers.deployment.disableTabDeploymentName"),
  disableTabConfigureOrganization: Ember.computed.alias("controllers.deployment.disableTabConfigureOrganization"),
  disableTabLifecycleEnvironment: Ember.computed.alias("controllers.deployment.disableTabLifecycleEnvironment"),

});
