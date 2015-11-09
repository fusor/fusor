import Ember from 'ember';
import ConfigureOrganizationMixin from "../../../mixins/configure-organization-mixin";

export default Ember.Controller.extend(ConfigureOrganizationMixin, {

  deploymentNewController: Ember.inject.controller('deployment-new'),

  organization: Ember.computed.alias("deploymentNewController.model.organization"),

  disableNextOnConfigureOrganization: Ember.computed.alias("deploymentNewController.disableNextOnConfigureOrganization"),
  satelliteTabRouteName: Ember.computed.alias("deploymentNewController.satelliteTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("deploymentNewController.lifecycleEnvironmentTabRouteName"),
  deploymentName: Ember.computed.alias("deploymentNewController.model.name"),

  actions: {
    selectOrganization(organization) {
      this.set('showAlertMessage', false);
      this.set('selectedOrganization', organization);
      return this.get('deploymentNewController.model').set('organization', organization);
    }
  }

});
