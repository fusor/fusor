import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application','rhci', 'deployment', 'satellite', 'configure-organization',
          'configure-environment', 'rhev-setup', 'hypervisor', 'hypervisor/discovered-host',
          'engine/discovered-host', 'storage',
          'networking', 'rhev-options', 'where-install',
          'cloudforms-storage-domain', 'cloudforms-vm', 'review'],

  // TODO - DRY and update while deployment is finished and button should say "Deployed"
  buttonDeployTitle: function() {
    if (this.get('controllers.deployment.isStarted')) {
      return 'Deploying ...';
    } else {
      return 'Deploy';
    }
  }.property('controllers.deployment.isStarted'),

  rhevValidated: function() {
    if (this.get('isRhev')) {
      return Ember.isPresent(this.get('controllers.deployment.rhev_engine_admin_password')) &&
             Ember.isPresent(this.get('selectedRhevEngine')) &&
             Ember.isPresent(this.get('selectedHypervisorHosts')) &&
             Ember.isPresent(this.get('controllers.deployment.rhev_storage_type'));
    } else {
      return true;
    }
  }.property('controllers.deployment.rhev_engine_admin_password', 'controllers.deployment.rhev_storage_type',
             'selectedRhevEngine', 'selectedHypervisorHosts'),

  cfmeValidated: function() {
    if (this.get('isCloudForms')) {
      return Ember.isPresent(this.get('controllers.deployment.cfme_install_loc'));
    } else {
      return true;
    }
  }.property('controllers.deployment.cfme_install_loc'),

  buttonDeployDisabled: function() {
    return (this.get('controllers.deployment.isStarted') || !(this.get('rhevValidated')) || !(this.get('cfmeValidated')));
  }.property('controllers.deployment.isStarted', 'rhevValidated', 'cfmeValidated'),

  showErrorMessage: false,
  errorMsg: null,
  foremanTasksURL: null,
  skipContent: Ember.computed.alias("controllers.deployment.skipContent"),

  isRhevOpen: true,
  isOpenStackOpen: false,
  isCloudFormsOpen: false,
  isSubscriptionsOpen: false,

  engineHostAddressDefault: 'ovirt-hypervisor.rhci.redhat.com',
  hostAddress: Ember.computed.alias("controllers.rhev-options.hostAddress"),
  engineHostName: Ember.computed.alias("controllers.rhev-options.engineHostName"),

  nameDeployment: Ember.computed.alias("controllers.deployment.name"),
  selectedOrganization: Ember.computed.alias("controllers.deployment.selectedOrganzation"),
  selectedEnvironment: Ember.computed.alias("controllers.deployment.selectedEnvironment"),
  rhevSetup: Ember.computed.alias("controllers.deployment.rhevSetup"),

  isRhev: Ember.computed.alias("controllers.deployment.isRhev"),
  isOpenStack: Ember.computed.alias("controllers.deployment.isOpenStack"),
  isCloudForms: Ember.computed.alias("controllers.deployment.isCloudForms"),
  isSubscriptions: Ember.computed.alias("controllers.deployment.isSubscriptions"),

  isSelfHosted: Ember.computed.alias("controllers.deployment.rhev_is_self_hosted"),
  selectedHypervisorHosts: Ember.computed.alias("controllers.deployment.discovered_hosts"),

  rhev_engine_host: Ember.computed.alias("controllers.deployment.discovered_host"),
  selectedRhevEngine: Ember.computed.alias("controllers.deployment.discovered_host"),

  nameRHCI: Ember.computed.alias("controllers.rhci.nameRHCI"),
  nameRhev: Ember.computed.alias("controllers.rhci.nameRhev"),
  nameOpenStack: Ember.computed.alias("controllers.rhci.nameOpenStack"),
  nameCloudForms: Ember.computed.alias("controllers.rhci.nameCloudForms"),
  nameSatellite: Ember.computed.alias("controllers.rhci.nameSatellite"),

});
