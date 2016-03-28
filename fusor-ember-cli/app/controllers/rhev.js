import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  storageController: Ember.inject.controller('storage'),
  rhevSetupController: Ember.inject.controller('rhev-setup'),
  rhevOptionsController: Ember.inject.controller('rhev-options'),
  engineDiscoveredHostController: Ember.inject.controller('engine/discovered-host'),
  hypervisorDiscoveredHostController: Ember.inject.controller('hypervisor/discovered-host'),

  rhevSetup: Ember.computed.alias("rhevSetupController.rhevSetup"),

  isSelfHost: Ember.computed('rhevSetup', function() {
    return (this.get('rhevSetup') === 'selfhost');
  }),

  hypervisorTabName: Ember.computed('isSelfHost', function() {
    if (this.get('isSelfHost')) {
      return 'Engine/Hypervisor';
    } else {
      return 'Hypervisor';
    }
  }),

  engineTabName: 'Engine',

  disableTabRhevHypervisors: Ember.computed(
    'isSelfHost',
    'validRhevEngine',
    function() {
      return !(this.get('isSelfHost') || this.get('validRhevEngine'));
    }
  ),
  disableTabRhevEngine: Ember.computed('isSelfHost', function(){
    return this.get('isSelfHost');
  }),

  disableTabRhevSetupType: false,
  hasEngine: Ember.computed.alias('deploymentController.hasEngine'),
  hasNoEngine: Ember.computed.not('hasEngine'),

  hasHypervisor: Ember.computed(
    'deploymentController.model.discovered_hosts.[]',
    function() {
      return (this.get('deploymentController.model.discovered_hosts.length') > 0);
    }
  ),
  hasNoHypervisor: Ember.computed.not('hasHypervisor'),

  isEngineHostnameValid: Ember.computed.not('engineDiscoveredHostController.isHostnameInvalid'),
  isHypervisorHostnameValid: Ember.computed.not('hypervisorDiscoveredHostController.isHostnameInvalid'),

  disableTabRhevConfiguration: Ember.computed(
    'isSelfHost',
    'invalidRhevEngine',
    'invalidRhevHypervisor',
    function() {
      return ((!this.get('isSelfHost') && this.get('invalidRhevEngine')) || this.get('invalidRhevHypervisor'));
    }
  ),

  disableTabRhevStorage: Ember.computed(
    'rhevOptionsController.disableNextRhevOptions',
    'disableTabRhevConfiguration',
    function() {
      return (this.get('disableTabRhevConfiguration') || this.get('rhevOptionsController.disableNextRhevOptions'));
    }
  ),

  validRhevSetup: true,

  validRhevEngine: Ember.computed(
    'hasEngine',
    'isEngineHostnameValid',
    function() {
      return (this.get('hasEngine') && this.get('isEngineHostnameValid'));
    }
  ),
  invalidRhevEngine: Ember.computed.not('validRhevEngine'),

  validRhevHypervisor: Ember.computed(
    'hasHypervisor',
    'isHypervisorHostnameValid',
    function() {
      return (this.get('hasHypervisor') && this.get('isHypervisorHostnameValid'));
    }
  ),
  invalidRhevHypervisor: Ember.computed.not('validRhevHypervisor'),

  validRhevOptions: Ember.computed.alias("rhevOptionsController.validRhevOptions"),
  validRhevStorage: Ember.computed.alias("storageController.validRhevStorage"),

  validRhev: Ember.computed(
    'isSelfHost',
    'validRhevSetup',
    'validRhevEngine',
    'validRhevHypervisor',
    'validRhevOptions',
    'validRhevStorage',
    function() {
      return this.get('validRhevSetup') && (this.get('validRhevEngine') || this.get('isSelfHost') && this.get('validRhevHypervisor')) &&
             this.get('validRhevOptions') && this.get('validRhevStorage');
    }
  )
});
