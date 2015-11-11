import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  storageController: Ember.inject.controller('storage'),
  rhevSetupController: Ember.inject.controller('rhev-setup'),
  rhevOptionsController: Ember.inject.controller('rhev-options'),

  rhevSetup: Ember.computed.alias("rhevSetupController.rhevSetup"),

  isSelfHost: Ember.computed('rhevSetup', function() {
    return (this.get('rhevSetup') === 'selfhost');
  }),

  engineTabName: Ember.computed('isSelfHost', function() {
    if (this.get('isSelfHost')) {
      return 'Engine/Hypervisor';
    } else {
      return 'Engine';
    }
  }),

  disableTabRhevSetupType: false,
  disableTabRhevEngine: false,

  hasEngine: Ember.computed.alias('deploymentController.hasEngine'),
  hasNoEngine: Ember.computed.not('hasEngine'),

  hasHypervisor: Ember.computed('deploymentController.model.discovered_hosts.[]', function() {
    return (this.get('deploymentController.model.discovered_hosts.length') > 0);
  }),
  hasNoHypervisor: Ember.computed.not('hasHypervisor'),

  disableTabRhevHypervisors: Ember.computed(
    'deploymentController.model.rhev_is_self_hosted',
    'hasNoEngine',
    function() {
      return (!this.get('deploymentController.model.rhev_is_self_hosted') && this.get('hasNoEngine'));
    }
  ),

  disableTabRhevConfiguration: Ember.computed(
    'deploymentController.model.rhev_is_self_hosted',
    'hasNoEngine',
    'hasNoHypervisor',
    function() {
      return ((this.get('deploymentController.model.rhev_is_self_hosted') && this.get('hasNoEngine')) ||
              (!this.get('deploymentController.model.rhev_is_self_hosted') && this.get('hasNoHypervisor'))
             );
    }
  ),

  disableTabRhevStorage: Ember.computed(
    'deploymentController.model.rhev_root_password',
    'deploymentController.model.rhev_engine_admin_password',
    function () {
      return (Ember.isBlank(this.get('deploymentController.model.rhev_root_password')) ||
              Ember.isBlank(this.get('deploymentController.model.rhev_engine_admin_password')) ||
              (this.get('deploymentController.model.rhev_root_password.length') < 8) ||
              (this.get('deploymentController.model.rhev_engine_admin_password.length') < 8)
             );
    }
  ),

  validRhevSetup: true,
  validRhevEngine: Ember.computed.alias("hasEngine"),
  validRhevHypervisor: Ember.computed.not("disableTabRhevConfiguration"),
  validRhevOptions: Ember.computed.alias("rhevOptionsController.validRhevOptions"),
  validRhevStorage: Ember.computed.alias("storageController.validRhevStorage"),

  validRhev: Ember.computed(
    'validRhevSetup',
    'validRhevEngine',
    'validRhevHypervisor',
    'validRhevOptions',
    'validRhevStorage',
    function() {
      return this.get('validRhevSetup') && this.get('validRhevEngine') && this.get('validRhevHypervisor') &&
             this.get('validRhevOptions') && this.get('validRhevStorage');
    }
  )
});
