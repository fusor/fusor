import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import ValidatesDeploymentNameMixin from "../../mixins/validates-deployment-name-mixin";
import CommonPasswordMixin from "../../mixins/common-password-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, ValidatesDeploymentNameMixin, CommonPasswordMixin, {

  name: Ember.computed.alias("deploymentController.name"),
  description: Ember.computed.alias("deploymentController.description"),

  lifecycleEnvironmentTabRouteName: Ember.computed.alias("deploymentController.lifecycleEnvironmentTabRouteName"),

  idSatName: 'deployment_sat_name',
  idSatDesc: 'deployment_sat_desc',

  isBackToDeployments: Ember.computed.alias("deploymentController.isBackToDeployments"),

  backRouteNameOnSatIndex: Ember.computed('isBackToDeployments', function() {
    if (this.get('isBackToDeployments')) {
      return 'deployments';
    } else {
      return 'deployment.start';
    }
  }),

  isRhev: Ember.computed.alias('deploymentController.isRhev'),
  isOpenStack: Ember.computed.alias("deploymentController.isOpenStack"),
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),
  isOpenShift: Ember.computed.alias("deploymentController.isOpenShift"),

  isValidDeploymentName: Ember.computed.alias("deploymentController.isValidDeploymentName"),
  isValidNameAndPassword: Ember.computed('isValidDeploymentName', 'isValidCommonPassword', function() {
    return (this.get('isValidDeploymentName') && this.get('isValidCommonPassword'));
  }),
  disableNextOnDeploymentName: Ember.computed.not('isValidNameAndPassword')

});
