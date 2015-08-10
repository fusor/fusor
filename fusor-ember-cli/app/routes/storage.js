import Ember from 'ember';

export default Ember.Route.extend({
  deactivate: function() {
    return this.send('saveDeployment', null);
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('rhev_storage_type', 'NFS');
    controller.set('rhev_gluster_ssh_port', 22);
  }

});
