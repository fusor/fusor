import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  satelliteTabRouteName: Ember.computed.alias("deploymentController.satelliteTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("deploymentController.lifecycleEnvironmentTabRouteName"),

  disableTabDeploymentName: Ember.computed.alias("deploymentController.disableTabDeploymentName"),
  disableTabLifecycleEnvironment: Ember.computed.alias("deploymentController.disableTabLifecycleEnvironment"),
  disableTabAccessInsights: Ember.computed.alias("deploymentController.disableTabAccessInsights")

});
