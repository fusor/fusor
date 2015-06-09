import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";
import DisableTabMixin from "../mixins/disable-tab-mixin";

export default Ember.ObjectController.extend(DeploymentControllerMixin, DisableTabMixin, {

  needs: ['configure-environment', 'deployments', 'rhev', 'cloudforms', 'subscriptions/credentials'],

  routeNameSatellite: 'satellite',

  useDefaultOrgViewForEnv: Ember.computed.alias("controllers.configure-environment.useDefaultOrgViewForEnv"),

  isOpenModal: Ember.computed.alias("controllers.deployments.isOpenModal"),
  deploymentInModal: Ember.computed.alias("controllers.deployments.deploymentInModal"),

  isDisabledRhev: Ember.computed.alias("satelliteInvalid"),
  isDisabledOpenstack: Ember.computed.alias("satelliteInvalid"),

  isDisabledCloudForms: function() {
    return (this.get('satelliteInvalid') ||
            (this.get('isRhev') && !(this.get('controllers.rhev.validRhev')))
           );
  }.property("satelliteInvalid", 'isRhev', 'controllers.rhev.validRhev'),

  isDisabledSubscriptions: function() {
    return (this.get('satelliteInvalid') ||
            (this.get('isRhev') && !(this.get('controllers.rhev.validRhev'))) ||
            (this.get('isCloudForms') && !(this.get('controllers.cloudforms.validCloudforms')))
           );
  }.property("satelliteInvalid", 'isRhev', 'controllers.rhev.validRhev', 'controllers.cloudforms.validCloudforms'),

  hasSubscriptionUUID: function() {
    return (Ember.isPresent(this.get('controllers.subscriptions/credentials.organizationUpstreamConsumerUUID')) ||
            Ember.isPresent(this.get('upstream_consumer_uuid'))
           );
  }.property('controllers.subscriptions/credentials.organizationUpstreamConsumerUUID', 'upstream_consumer_uuid'),

  isDisabledReview: function() {
    return (this.get('isDisabledSubscriptions') || !this.get("hasSubscriptionUUID"));
  }.property('isDisabledSubscriptions', 'hasSubscriptionUUID'),

  hasLifecycleEnvironment: function() {
    return (!!(this.get('lifecycle_environment.id')) || this.get('useDefaultOrgViewForEnv'));
  }.property('lifecycle_environment', 'useDefaultOrgViewForEnv'),
  hasNoLifecycleEnvironment: Ember.computed.not('hasLifecycleEnvironment'),

  validations: {
    name: {
      presence: true,
      length: { minimum: 2 }
    },
  },

  selectedRhevEngine: null,

  satelliteInvalid: Ember.computed.or('hasNoName', 'hasNoOrganization', 'hasNoLifecycleEnvironment'),

  skipContent: false,

  isStarted: function() {
    return !!(this.get('model.foreman_task_uuid'));
  }.property('model.foreman_task_uuid'),

});
