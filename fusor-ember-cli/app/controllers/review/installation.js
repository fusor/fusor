import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application','rhci', 'deployment', 'satellite', "satellite/index", 'configure-organization',
          'configure-environment', 'rhev-setup', 'hypervisor', 'hypervisor/discovered-host',
          'engine/discovered-host', 'storage',
          'networking', 'rhev-options', 'osp-settings', 'osp-configuration', 'where-install',
          'cloudforms-storage-domain', 'cloudforms-vm'],

  nameDeployment: Ember.computed.alias("controllers.satellite/index.name"),
  selectedOrganization: Ember.computed.alias("controllers.configure-organization.selectedOrganzation"),
  selectedEnvironment: Ember.computed.alias("controllers.configure-organization.selectedEnvironment"),
  rhevSetup: Ember.computed.alias("controllers.rhev-setup.rhevSetup"),

  hypervisorSelectedHosts: Ember.computed.alias("controllers.hypervisor/discovered-host.selectedHosts"),
  engineSelectedHosts: Ember.computed.alias("controllers.engine/discovered-host.selectedHosts"),

  oVirtHostedtype: function() {
    if (this.get('rhevSetup') === 'selfhost') {
      return "Self Hosted";
    } else {
      return "Host + Engine";
    }
  }.property('rhevSetup'),

  isSelfHosted: function () {
    return (this.get('rhevSetup') === 'selfhost');
  }.property('rhevSetup'),

  nameRHCI: Ember.computed.alias("controllers.rhci.nameRHCI"),
  nameRhev: Ember.computed.alias("controllers.rhci.nameRhev"),
  nameOpenStack: Ember.computed.alias("controllers.rhci.nameOpenStack"),
  nameCloudForms: Ember.computed.alias("controllers.rhci.nameCloudForms"),
  nameSatellite: Ember.computed.alias("controllers.rhci.nameSatellite"),

});
