import Ember from 'ember';
import ConfigureOrganizationMixin from "../../../mixins/configure-organization-mixin";

export default Ember.Controller.extend(ConfigureOrganizationMixin, {

  needs: ['deployment-new', 'deployment'],

  organization: Ember.computed.alias("controllers.deployment-new.organization"),

  disableNextOnConfigureOrganization: Ember.computed.alias("controllers.deployment-new.disableNextOnConfigureOrganization"),
  satelliteTabRouteName: Ember.computed.alias("controllers.deployment-new.satelliteTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("controllers.deployment-new.lifecycleEnvironmentTabRouteName"),
  deploymentName: Ember.computed.alias("controllers.deployment-new.name"),

  actions: {
    selectOrganization: function(organization) {
      this.set('showAlertMessage', false);
      this.set('selectedOrganization', organization);
      return this.get('controllers.deployment-new').set('organization', organization);
    }
  },

});
