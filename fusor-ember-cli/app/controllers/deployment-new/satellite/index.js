import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment-new', 'deployment-new/satellite', 'deployment', 'application'],

  name: Ember.computed.alias("controllers.deployment-new.name"),
  description: Ember.computed.alias("controllers.deployment-new.description"),

  organizationTabRouteName: Ember.computed.alias("controllers.deployment-new/satellite.organizationTabRouteName"),

  disableNextOnDeploymentName: Ember.computed.alias("controllers.deployment-new.disableNextOnDeploymentName"),

  idSatName: 'deployment_new_sat_name',
  idSatDesc: 'deployment_new_sat_desc',

  backRouteNameOnSatIndex: 'deployment-new.start',

  deploymentNames: Ember.computed.alias("controllers.application.deploymentNames")

});
