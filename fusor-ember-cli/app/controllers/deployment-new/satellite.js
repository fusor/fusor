import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment-new'],

  satelliteTabRouteName: Ember.computed.alias("controllers.deployment-new.satelliteTabRouteName"),
  organizationTabRouteName: Ember.computed.alias("controllers.deployment-new.organizationTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("controllers.deployment-new.lifecycleEnvironmentTabRouteName"),

  disableTabDeploymentName: Ember.computed.alias("controllers.deployment-new.disableTabDeploymentName"),
  disableTabConfigureOrganization: Ember.computed.alias("controllers.deployment-new.disableTabConfigureOrganization"),
  disableTabLifecycleEnvironment: Ember.computed.alias("controllers.deployment-new.disableTabLifecycleEnvironment"),

  backRouteNameOnSatIndex: 'deployment-new.start'

  backRouteNameOnSatIndex: 'deployment-new.start',

});
