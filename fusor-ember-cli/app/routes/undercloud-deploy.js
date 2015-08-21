import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
      return {
        deploymentMode: 'POC',
        imagePath: '.',
        undercloudIP: '192.0.2.1/24',
        sshUser: '',
        sshPassword: '',
        localInterface: 'eth1',
        masqueradeNetwork: '192.0.2.0/24',
        dhcpStart: '192.0.2.5',
        dhcpEnd: '192.0.2.24',
        networkCidr: '192.0.2.0/24',
        networkGateway: '192.0.2.1',
        discoveryInterface: 'br-ctlplane',
        discoveryIpStart: '192.0.2.100',
        discoveryIpEnd: '192.0.2.120',
        discoveryRunbench: false,
        undercloudDebug: true
      };
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('showAlertMessage', false);
  },

  deactivate: function() {
    return this.send('saveDeployment', null);
  }

});
