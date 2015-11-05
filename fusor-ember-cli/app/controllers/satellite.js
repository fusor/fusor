import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  satelliteTabRouteName: Ember.computed.alias("controllers.deployment.satelliteTabRouteName"),
  organizationTabRouteName: Ember.computed.alias("controllers.deployment.organizationTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("controllers.deployment.lifecycleEnvironmentTabRouteName"),

  disableTabDeploymentName: Ember.computed.alias("controllers.deployment.disableTabDeploymentName"),
  disableTabConfigureOrganization: Ember.computed.alias("controllers.deployment.disableTabConfigureOrganization"),
  disableTabLifecycleEnvironment: Ember.computed.alias("controllers.deployment.disableTabLifecycleEnvironment"),
  disableTabAccessInsights: Ember.computed.alias("controllers.deployment.disableTabAccessInsights")

});
