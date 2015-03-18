import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application','rhci', 'deployment', 'satellite', 'configure-organization',
          'configure-environment', 'rhev-setup', 'hypervisor', 'hypervisor/discovered-host',
          'engine/discovered-host', 'storage',
          'networking', 'rhev-options', 'osp-settings', 'osp-configuration', 'where-install',
          'cloudforms-storage-domain', 'cloudforms-vm', 'review'],

  hypervisorHostgroupId: 9,
  engineHostgroupId: 7,

  engineAdminPasswordLookupKeyId: 55,
  engineHostAddressLookupKeyId: 61,
  engineHostAddressDefault: 'ovirt-hypervisor.rhci.redhat.com',
  hostAddress: Ember.computed.alias("controllers.rhev-options.hostAddress"),
  engineHostName: Ember.computed.alias("controllers.rhev-options.engineHostName"),

  //selectedRhevEngine: Ember.computed.alias("controllers.deployment.selectedRhevEngine"),

  nameDeployment: Ember.computed.alias("controllers.deployment.name"),
  selectedOrganization: Ember.computed.alias("controllers.deployment.selectedOrganzation"),
  selectedEnvironment: Ember.computed.alias("controllers.deployment.selectedEnvironment"),
  rhevSetup: Ember.computed.alias("controllers.deployment.rhevSetup"),

  isRhev: Ember.computed.alias("controllers.deployment.isRhev"),
  isOpenStack: Ember.computed.alias("controllers.deployment.isOpenStack"),
  isCloudForms: Ember.computed.alias("controllers.deployment.isCloudForms"),

  hypervisorSelectedHosts: Ember.computed.alias("controllers.hypervisor/discovered-host.selectedHosts"),
  engineSelectedHosts: Ember.computed.alias("controllers.engine/discovered-host.selectedHosts"),

  hypervisorSelectedId: Ember.computed.alias("controllers.hypervisor/discovered-host.idsChecked"),
  engineSelectedId: Ember.computed.alias("controllers.engine/discovered-host.idsChecked"),
  isSelfHosted: Ember.computed.alias("controllers.deployment.rhev_is_self_hosted"),
  rhev_engine_host: Ember.computed.alias("controllers.deployment.rhev_engine_host"),
  selectedRhevEngine: Ember.computed.alias("controllers.engine/discovered-host.selectedRhevEngine"),


  nameRHCI: Ember.computed.alias("controllers.rhci.nameRHCI"),
  nameRhev: Ember.computed.alias("controllers.rhci.nameRhev"),
  nameOpenStack: Ember.computed.alias("controllers.rhci.nameOpenStack"),
  nameCloudForms: Ember.computed.alias("controllers.rhci.nameCloudForms"),
  nameSatellite: Ember.computed.alias("controllers.rhci.nameSatellite"),

  actions: {
    installDeployment: function(options) {
      console.log('OPTIONS');
      console.log(options);
      this.get('controllers.review').set('disableTabProgress', false);
      return this.transitionTo('review.progress');
    }
  }

});
