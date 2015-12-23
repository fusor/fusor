import Ember from 'ember';
import ConfigureOrganizationMixin from "../../../mixins/configure-organization-mixin";
import NeedsDeploymentNewMixin from "../../../mixins/needs-deployment-new-mixin";

export default Ember.Controller.extend(ConfigureOrganizationMixin, NeedsDeploymentNewMixin, {

  organization: Ember.computed.alias("deploymentNewController.model.organization"),

  disableNextOnConfigureOrganization: Ember.computed.alias("deploymentNewController.disableNextOnConfigureOrganization"),
  satelliteTabRouteName: Ember.computed.alias("deploymentNewController.satelliteTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("deploymentNewController.lifecycleEnvironmentTabRouteName"),

  actions: {
    selectOrganization(organization) {
      this.set('showAlertMessage', false);
      this.set('selectedOrganization', organization);
      return this.get('deploymentNewController.model').set('organization', organization);
    }
  }

});
