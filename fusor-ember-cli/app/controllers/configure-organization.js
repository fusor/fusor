import Ember from 'ember';
import ConfigureOrganizationMixin from "../mixins/configure-organization-mixin";
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(ConfigureOrganizationMixin, NeedsDeploymentMixin, {

  organization: Ember.computed.alias("deploymentController.organization"),

  disableNextOnConfigureOrganization: Ember.computed.alias("deploymentController.disableNextOnConfigureOrganization"),
  satelliteTabRouteName: Ember.computed.alias("deploymentController.satelliteTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("deploymentController.lifecycleEnvironmentTabRouteName"),
  deploymentName: Ember.computed.alias("deploymentController.name"),
  isStarted: Ember.computed.alias("deploymentController.isStarted"),

  actions: {
    selectOrganization: function(organization) {
      this.set('showAlertMessage', false);
      this.set('selectedOrganization', organization);
      return this.get('deploymentController').set('organization', organization);
    }
  }

});
