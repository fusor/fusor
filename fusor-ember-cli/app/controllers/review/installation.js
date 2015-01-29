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

  hypervisorSelectedId: Ember.computed.alias("controllers.hypervisor/discovered-host.idChecked"),
  engineSelectedId: Ember.computed.alias("controllers.engine/discovered-host.idChecked"),

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

  actions: {
    installDeployment: function(options) {
    console.log('OPTIONS');
    console.log(options);

    var self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      Ember.$.ajax({
          url: '/api/v2/discovered_hosts/' + self.get('hypervisorSelectedId'),
          type: "PUT",
          data: JSON.stringify({'discovered_host': { 'hostgroup_id': 2, 'root_pass': 'redhat!!'}}),
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Basic " + self.get('session.basicAuthToken')
          },
          success: function(response) {
            console.log(respone);
            alert('success');
            resolve({currentUser: response,
                     loginUsername: response.login,
                     basicAuthToken: options.basicAuthToken,
                     authType: 'Basic'});
          },

          error: function(response){
            reject(response);
          }
      });
    });
    }
  }

});
