import Ember from 'ember';
import ConfigureOrganizationMixin from "../mixins/configure-organization-mixin";
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(ConfigureOrganizationMixin, NeedsDeploymentMixin, {

  organization: Ember.computed.alias("controllers.deployment.organization"),

  disableNextOnConfigureOrganization: Ember.computed.alias("controllers.deployment.disableNextOnConfigureOrganization"),
  satelliteTabRouteName: Ember.computed.alias("controllers.deployment.satelliteTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("controllers.deployment.lifecycleEnvironmentTabRouteName"),
  deploymentName: Ember.computed.alias("controllers.deployment.name"),
  isStarted: Ember.computed.alias("controllers.deployment.isStarted"),

  actions: {
    selectOrganization: function(organization) {
      this.set('showAlertMessage', false);
      this.set('selectedOrganization', organization);
      return this.get('controllers.deployment').set('organization', organization);
    }
  }

});
