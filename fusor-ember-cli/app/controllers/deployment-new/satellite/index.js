import Ember from 'ember';
import NeedsDeploymentNewMixin from "../../../mixins/needs-deployment-new-mixin";
import ValidatesDeploymentNameMixin from "../../../mixins/validates-deployment-name-mixin";

export default Ember.Controller.extend(NeedsDeploymentNewMixin, ValidatesDeploymentNameMixin, {

  deploymentNewController: Ember.inject.controller('deployment-new'),

  name: Ember.computed.alias("deploymentNewController.name"),
  description: Ember.computed.alias("deploymentNewController.description"),

  organizationTabRouteName: Ember.computed.alias("deploymentNewController.organizationTabRouteName"),
  lifecycleEnvironmentTabRouteName: Ember.computed.alias("deploymentNewController.lifecycleEnvironmentTabRouteName"),

  disableNextOnDeploymentName: Ember.computed.alias("deploymentNewController.disableNextOnDeploymentName"),

  idSatName: 'deployment_new_sat_name',
  idSatDesc: 'deployment_new_sat_desc',

  backRouteNameOnSatIndex: 'deployment-new.start'
});
