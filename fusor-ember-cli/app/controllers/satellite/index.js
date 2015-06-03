import Ember from 'ember';

export default Ember.Controller.extend({

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

  backRouteNameOnSatIndex: 'deployment.start',

});
