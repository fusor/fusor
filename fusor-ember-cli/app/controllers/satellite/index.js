import Ember from 'ember';
import SatelliteControllerMixin from "../../mixins/satellite-controller-mixin";

export default Ember.Controller.extend(SatelliteControllerMixin, {

  needs: ['satellite', 'deployment'],

  validations: {
    name: {
      presence: true,
    },
  },

  name: Ember.computed.alias("controllers.deployment.name"),
  description: Ember.computed.alias("controllers.deployment.description"),

  organizationTabRouteName: Ember.computed.alias("controllers.deployment.organizationTabRouteName"),

  disableNextOnDeploymentName: Ember.computed.alias("controllers.deployment.disableNextOnDeploymentName"),

  idSatName: 'deployment_sat_name',
  idSatDesc: 'deployment_sat_desc',

});
