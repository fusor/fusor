import Ember from 'ember';
import ConfigureOrganizationMixin from "../mixins/configure-organization-mixin";

export default Ember.Controller.extend(ConfigureOrganizationMixin, {

  needs: ['deployment'],

  organization: Ember.computed.alias("controllers.deployment.organization"),

  disableNextOnConfigureOrganization: Ember.computed.alias("controllers.deployment.disableNextOnConfigureOrganization"),
  satelliteTabRouteName: Ember.computed.alias("controllers.deployment.satelliteTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("controllers.deployment.lifecycleEnvironmentTabRouteName"),
  deploymentName: Ember.computed.alias("controllers.deployment.name"),

  actions: {
    selectOrganization: function(organization) {
      this.set('showAlertMessage', false);
      this.set('selectedOrganization', organization);
      return this.get('controllers.deployment').set('organization', organization);
    },

  },

});
