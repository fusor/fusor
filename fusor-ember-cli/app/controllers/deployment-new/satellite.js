import Ember from 'ember';

export default Ember.Controller.extend({

  deploymentNewController: Ember.inject.controller('deployment-new'),

  satelliteTabRouteName: Ember.computed.alias("deploymentNewController.satelliteTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("deploymentNewController.lifecycleEnvironmentTabRouteName"),

  disableTabDeploymentName: Ember.computed.alias("deploymentNewController.disableTabDeploymentName"),
  disableTabLifecycleEnvironment: Ember.computed.alias("deploymentNewController.disableTabLifecycleEnvironment"),
  disableTabAccessInsights: true

});
