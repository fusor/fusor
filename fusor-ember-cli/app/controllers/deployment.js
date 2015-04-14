import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";
import DisableTabMixin from "../mixins/disable-tab-mixin";

export default Ember.ObjectController.extend(DeploymentControllerMixin, DisableTabMixin, {

  validations: {
    name: {
      presence: true,
      length: { minimum: 2 }
    },
  },

  selectedRhevEngine: null,

  satelliteInvalid: Ember.computed.or('hasNoName', 'hasNoOrganization', 'hasNoLifecycleEnvironment'),

  // disable Steps 2, 3, 4, etc on wizard
  isDisabledRhev: Ember.computed.alias("satelliteInvalid"),
  isDisabledOpenstack: Ember.computed.alias("satelliteInvalid"),
  isDisabledCloudForms: Ember.computed.alias("satelliteInvalid"),
  isDisabledSubscriptions: Ember.computed.alias("satelliteInvalid"),
  isDisabledReview: Ember.computed.alias("satelliteInvalid"),

});
