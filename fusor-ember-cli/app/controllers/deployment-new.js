import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";
import DisableTabMixin from "../mixins/disable-tab-mixin";

export default Ember.ObjectController.extend(DeploymentControllerMixin, DisableTabMixin, {

  needs: ['deployment-new/satellite/configure-environment'],

  routeNameSatellite: 'deployment-new.satellite',

  useDefaultOrgViewForEnv: Ember.computed.alias("controllers.deployment-new/satellite/configure-environment.useDefaultOrgViewForEnv"),

  // these tabs will always be disabled within deployment-new
  isDisabledRhev: true,
  isDisabledOpenstack: true,
  isDisabledCloudForms: true,
  isDisabledSubscriptions: true,
  isDisabledReview: true,

  hasLifecycleEnvironment: function() {
    return (!!(this.get('lifecycle_environment.id')) || this.get('useDefaultOrgViewForEnv'));
  }.property('lifecycle_environment', 'useDefaultOrgViewForEnv'),
  hasNoLifecycleEnvironment: Ember.computed.not('hasLifecycleEnvironment'),

});
