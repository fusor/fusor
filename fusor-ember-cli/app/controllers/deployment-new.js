import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";
import DisableTabMixin from "../mixins/disable-tab-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, DisableTabMixin, {

  deploymentNewSatelliteIndex: Ember.inject.controller('deployment-new/satellite/index'),
  deploymentNewConfigureEnvironment: Ember.inject.controller('deployment-new/satellite/configure-environment'),

  routeNameSatellite: 'deployment-new.satellite',
  routeNameStart: 'deployment-new.start',
  backRouteNameOnSatIndex: 'deployments-new.start', //default, should be overwritten by route hooks

  useDefaultOrgViewForEnv: Ember.computed.alias("deploymentNewConfigureEnvironment.useDefaultOrgViewForEnv"),
  selectedEnvironmentDeploymentNew: Ember.computed.alias("deploymentNewConfigureEnvironment.selectedEnvironment"),

  // these tabs will always be disabled within deployment-new
  isDisabledRhev: true,
  isDisabledOpenstack: true,
  isDisabledOpenShift: true,
  isDisabledCloudForms: true,
  isDisabledSubscriptions: true,
  isDisabledReview: true,

  // selectedEnvironmentDeploymentNew is set to 'Library' by routes/deployment-new/satellite/configure-environment.js if Library is only environment
  hasLifecycleEnvironment: Ember.computed('model.lifecycle_environment', 'useDefaultOrgViewForEnv', function() {
    return (!!(this.get('model.lifecycle_environment.id')) || this.get('useDefaultOrgViewForEnv') || this.get('selectedEnvironmentDeploymentNew'));
  }),
  hasNoLifecycleEnvironment: Ember.computed.not('hasLifecycleEnvironment'),

  isValidCommonPassword: Ember.computed.alias("deploymentNewSatelliteIndex.isValidCommonPassword"),

  isValidNameAndPassword: Ember.computed('isValidDeploymentName', 'isValidCommonPassword', function () {
    return (this.get('isValidDeploymentName') && this.get('isValidCommonPassword'));
  }),

  hasInvalidNameOrPassword: Ember.computed.not('isValidNameAndPassword'),
  disableTabLifecycleEnvironment: Ember.computed.not('isValidNameAndPassword')

});
