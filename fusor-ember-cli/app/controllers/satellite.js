import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  satelliteTabRouteName: Ember.computed.alias("deploymentController.satelliteTabRouteName"),
  organizationTabRouteName: Ember.computed.alias("deploymentController.organizationTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("deploymentController.lifecycleEnvironmentTabRouteName"),

  disableTabDeploymentName: Ember.computed.alias("deploymentController.disableTabDeploymentName"),
  disableTabConfigureOrganization: Ember.computed.alias("deploymentController.disableTabConfigureOrganization"),
  disableTabLifecycleEnvironment: Ember.computed.alias("deploymentController.disableTabLifecycleEnvironment"),
  disableTabAccessInsights: Ember.computed.alias("deploymentController.disableTabAccessInsights")

});
