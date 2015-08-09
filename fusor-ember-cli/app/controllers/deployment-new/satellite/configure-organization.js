import Ember from 'ember';
import ConfigureOrganizationMixin from "../../../mixins/configure-organization-mixin";

export default Ember.Controller.extend(ConfigureOrganizationMixin, {

  needs: ['deployment-new', 'deployment', 'application'],

  organization: Ember.computed.alias("controllers.deployment-new.model.organization"),

  disableNextOnConfigureOrganization: Ember.computed.alias("controllers.deployment-new.disableNextOnConfigureOrganization"),
  satelliteTabRouteName: Ember.computed.alias("controllers.deployment-new.satelliteTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("controllers.deployment-new.lifecycleEnvironmentTabRouteName"),
  deploymentName: Ember.computed.alias("controllers.deployment-new.model.name"),

  actions: {
    selectOrganization: function(organization) {
      this.set('showAlertMessage', false);
      this.set('selectedOrganization', organization);
      return this.get('controllers.deployment-new.model').set('organization', organization);
    }
  }

});
