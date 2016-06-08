import Ember from 'ember';
import NeedsDeploymentNewMixin from "../../../mixins/needs-deployment-new-mixin";
import ValidatesDeploymentNameMixin from "../../../mixins/validates-deployment-name-mixin";
import CommonPasswordMixin from "../../../mixins/common-password-mixin";

export default Ember.Controller.extend(NeedsDeploymentNewMixin, ValidatesDeploymentNameMixin, CommonPasswordMixin, {

  deploymentNewController: Ember.inject.controller('deployment-new'),

  name: Ember.computed.alias("deploymentNewController.name"),
  description: Ember.computed.alias("deploymentNewController.description"),

  lifecycleEnvironmentTabRouteName: Ember.computed.alias("deploymentNewController.lifecycleEnvironmentTabRouteName"),

  idSatName: 'deployment_new_sat_name',
  idSatDesc: 'deployment_new_sat_desc',

  backRouteNameOnSatIndex: Ember.computed.alias("deploymentNewController.backRouteNameOnSatIndex"),

  isRhev: Ember.computed.alias('deploymentNewController.isRhev'),
  isOpenStack: Ember.computed.alias("deploymentNewController.isOpenStack"),
  isCloudForms: Ember.computed.alias("deploymentNewController.isCloudForms"),
  isOpenShift: Ember.computed.alias("deploymentNewController.isOpenShift"),

  isValidDeploymentName: Ember.computed.alias("deploymentNewController.isValidDeploymentName"),
  isValidNameAndPassword: Ember.computed('isValidDeploymentName', 'isValidCommonPassword', function() {
    return (this.get('isValidDeploymentName') && this.get('isValidCommonPassword'));
  }),
  disableNextOnDeploymentName: Ember.computed.not('isValidNameAndPassword')

});
