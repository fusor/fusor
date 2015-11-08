import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  storageController: Ember.inject.controller('storage'),
  rhevSetupController: Ember.inject.controller('rhev-setup'),
  rhevOptionsController: Ember.inject.controller('rhev-options'),

  rhevSetup: Ember.computed.alias("rhevSetupController.rhevSetup"),

  isSelfHost: function() {
    return (this.get('rhevSetup') === 'selfhost');
  }.property('rhevSetup'),

  engineTabName: function() {
    if (this.get('isSelfHost')) {
      return 'Engine/Hypervisor';
    } else {
      return 'Engine';
    }
  }.property('isSelfHost'),

  disableTabRhevSetupType: false,
  disableTabRhevEngine: false,

  hasEngine: Ember.computed.alias('deploymentController.hasEngine'),
  hasNoEngine: Ember.computed.not('hasEngine'),

  hasHypervisor: function() {
    return (this.get('deploymentController.model.discovered_hosts.length') > 0);
  }.property('deploymentController.model.discovered_hosts.[]'),
  hasNoHypervisor: Ember.computed.not('hasHypervisor'),

  disableTabRhevHypervisors: function() {
    return (!this.get('deploymentController.model.rhev_is_self_hosted') && this.get('hasNoEngine'));
  }.property('deploymentController.model.rhev_is_self_hosted', 'hasNoEngine'),

  disableTabRhevConfiguration: function() {
    return ((this.get('deploymentController.model.rhev_is_self_hosted') && this.get('hasNoEngine')) ||
            (!this.get('deploymentController.model.rhev_is_self_hosted') && this.get('hasNoHypervisor'))
           );
  }.property('deploymentController.model.rhev_is_self_hosted', 'hasNoEngine', 'hasNoHypervisor'),

  disableTabRhevStorage: function () {
    return (Ember.isBlank(this.get('deploymentController.model.rhev_root_password')) ||
            Ember.isBlank(this.get('deploymentController.model.rhev_engine_admin_password')) ||
            (this.get('deploymentController.model.rhev_root_password.length') < 8) ||
            (this.get('deploymentController.model.rhev_engine_admin_password.length') < 8)
           );
  }.property('deploymentController.model.rhev_root_password', 'deploymentController.model.rhev_engine_admin_password'),

  validRhevSetup: true,
  validRhevEngine: Ember.computed.alias("hasEngine"),
  validRhevHypervisor: Ember.computed.not("disableTabRhevConfiguration"),
  validRhevOptions: Ember.computed.alias("rhevOptionsController.validRhevOptions"),
  validRhevStorage: Ember.computed.alias("storageController.validRhevStorage"),

  validRhev: function() {
    return this.get('validRhevSetup') && this.get('validRhevEngine') && this.get('validRhevHypervisor') &&
           this.get('validRhevOptions') && this.get('validRhevStorage');
  }.property('validRhevSetup', 'validRhevEngine', 'validRhevHypervisor', 'validRhevOptions', 'validRhevStorage')
});
