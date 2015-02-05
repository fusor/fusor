import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application','rhci', 'deployment', 'satellite', "satellite/index", 'configure-organization',
          'configure-environment', 'rhev-setup', 'hypervisor', 'hypervisor/discovered-host',
          'engine/discovered-host', 'storage',
          'networking', 'rhev-options', 'osp-settings', 'osp-configuration', 'where-install',
          'cloudforms-storage-domain', 'cloudforms-vm', 'review'],

  isRhevOpen: false,
  isOpenStackOpen: false,
  isCloudFormsOpen: false,

  hypervisorHostgroupId: 9,
  engineHostgroupId: 7,

  engineAdminPasswordLookupKeyId: 55,
  engineHostAddressLookupKeyId: 61,
  engineHostAddressDefault: 'ovirt-hypervisor.rhci.redhat.com',
  hostAddress: Ember.computed.alias("controllers.rhev-options.hostAddress"),

  nameDeployment: Ember.computed.alias("controllers.satellite/index.name"),
  selectedOrganization: Ember.computed.alias("controllers.configure-organization.selectedOrganzation"),
  selectedEnvironment: Ember.computed.alias("controllers.configure-environment.selectedEnvironment"),
  rhevSetup: Ember.computed.alias("controllers.rhev-setup.rhevSetup"),

  isRhev: Ember.computed.alias("controllers.rhci.isRhev"),
  isOpenStack: Ember.computed.alias("controllers.rhci.isOpenStack"),
  isCloudForms: Ember.computed.alias("controllers.rhci.isCloudForms"),

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

    //TODO - inherit root_pass for hostgroup
    var self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {

      //hypervisor
      Ember.$.ajax({
          url: '/api/v2/discovered_hosts/' + self.get('hypervisorSelectedId'),
          type: "PUT",
          data: JSON.stringify({'discovered_host': { 'name': self.get('hostAddress'), 'hostgroup_id': self.get('hypervisorHostgroupId'), 'root_pass': 'redhat!!', 'overwrite': true} }),
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Basic " + self.get('session.basicAuthToken')
          },
          success: function(response) {
            console.log('YEA!!! installing hypervisor');
            console.log(response);
            resolve({currentUser: response,
                     loginUsername: response.login,
                     basicAuthToken: options.basicAuthToken,
                     authType: 'Basic'});
          },

          error: function(response){
            reject(response);
          }
      });

      //engine
      Ember.$.ajax({
          url: '/api/v2/discovered_hosts/' + self.get('engineSelectedId'),
          type: "PUT",
          data: JSON.stringify({'discovered_host': { 'name': 'ovirt-engine', 'hostgroup_id': self.get('engineHostgroupId'), 'root_pass': 'redhat!!', 'overwrite': true} }),
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Basic " + self.get('session.basicAuthToken')
          },
          success: function(response) {
            console.log('YEA!!! installing ENGINE');
            console.log(response);
            resolve({currentUser: response,
                     loginUsername: response.login,
                     basicAuthToken: options.basicAuthToken,
                     authType: 'Basic'});
          },

          error: function(response){
            reject(response);
          }
      });

      //engine's hypervisor hostAddress
     if (self.get('hostAddress')) {
      Ember.$.ajax({
          url: '/api/v2/smart_class_parameters/' + self.get('engineHostAddressLookupKeyId') + '/override_values',
          type: "POST",
          data: JSON.stringify({'override_value': { 'value': self.get('hostAddress'), 'match': 'fqdn=ovirt-engine.rhci.redhat.com' } }),
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Basic " + self.get('session.basicAuthToken')
          },
          success: function(response) {
            console.log('updating host address');
            console.log(response);
            resolve({currentUser: response,
                     loginUsername: response.login,
                     basicAuthToken: options.basicAuthToken,
                     authType: 'Basic'});
          },

          error: function(response){
            reject(response);
          }
      });

     }
      //engine admin password
     if (self.get('controllers.rhev-options.engineAdminPassword')) {
      Ember.$.ajax({
          url: '/api/v2/smart_class_parameters/' + self.get('engineAdminPasswordLookupKeyId') + '/override_values',
          type: "POST",
          data: JSON.stringify({'override_value': { 'value': self.get('controllers.rhev-options.engineAdminPassword'), 'match': 'fqdn=ovirt-engine.rhci.redhat.com' } }),
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Basic " + self.get('session.basicAuthToken')
          },
          success: function(response) {
            console.log('updating admin password');
            console.log(response);
            resolve({currentUser: response,
                     loginUsername: response.login,
                     basicAuthToken: options.basicAuthToken,
                     authType: 'Basic'});
          },

          error: function(response){
            reject(response);
          }
      });
    }
    self.set('controllers.review.disableTabProgress', false);
    return self.transitionTo('review.progress');
    });
    }
  }

});
