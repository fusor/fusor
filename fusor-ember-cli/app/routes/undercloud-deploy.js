import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
      return {
        undercloudIP: '',
        sshUser: 'root',
        sshPassword: 'changeme',
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
