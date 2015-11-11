import Ember from 'ember';

export default Ember.Controller.extend({

  deploymentNewController: Ember.inject.controller('deployment-new'),

  satelliteTabRouteName: Ember.computed.alias("deploymentNewController.satelliteTabRouteName"),
  organizationTabRouteName: Ember.computed.alias("deploymentNewController.organizationTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("deploymentNewController.lifecycleEnvironmentTabRouteName"),

  disableTabDeploymentName: Ember.computed.alias("deploymentNewController.disableTabDeploymentName"),
  disableTabConfigureOrganization: Ember.computed.alias("deploymentNewController.disableTabConfigureOrganization"),
  disableTabLifecycleEnvironment: Ember.computed.alias("deploymentNewController.disableTabLifecycleEnvironment"),
  disableTabAccessInsights: true,

  backRouteNameOnSatIndex: 'deployment-new.start'

});
