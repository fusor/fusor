import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";
import DisableTabMixin from "../mixins/disable-tab-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, DisableTabMixin, {

  needs: ['deployment-new/satellite/configure-environment', 'application'],

  routeNameSatellite: 'deployment-new.satellite',

  useDefaultOrgViewForEnv: Ember.computed.alias("controllers.deployment-new/satellite/configure-environment.useDefaultOrgViewForEnv"),
  selectedEnvironmentDeploymentNew: Ember.computed.alias("controllers.deployment-new/satellite/configure-environment.selectedEnvironment"),

  // these tabs will always be disabled within deployment-new
  isDisabledRhev: true,
  isDisabledOpenstack: true,
  isDisabledCloudForms: true,
  isDisabledSubscriptions: true,
  isDisabledReview: true,

  // selectedEnvironmentDeploymentNew is set to 'Library' by routes/deployment-new/satellite/configure-environment.js if Library is only environment
  hasLifecycleEnvironment: function() {
    return (!!(this.get('model.lifecycle_environment.id')) || this.get('useDefaultOrgViewForEnv') || this.get('selectedEnvironmentDeploymentNew'));
  }.property('lifecycle_environment', 'useDefaultOrgViewForEnv'),
  hasNoLifecycleEnvironment: Ember.computed.not('hasLifecycleEnvironment')

});
