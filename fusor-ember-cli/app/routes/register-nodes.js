import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
      var deploymentId = this.modelFor('deployment').get('id');
      return Ember.RSVP.hash({
          nodes: this.store.find('node', {deployment_id: deploymentId}),
          profiles: this.store.find('flavor', {deployment_id: deploymentId})
      });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('showAlertMessage', false);
    var self = this;
    var deploymentId = this.modelFor('deployment').get('id');
    this.store.find('image', {deployment_id: deploymentId}).then(function(results) {
      var bmDeployKernelImage = results.findBy('name', 'bm-deploy-kernel');
      var bmDeployRamdiskImage = results.findBy('name', 'bm-deploy-ramdisk');
      controller.set('bmDeployKernelImage', bmDeployKernelImage);
      controller.set('bmDeployRamdiskImage', bmDeployRamdiskImage);
    });
  },

  deactivate: function() {
    return this.send('saveDeployment', null);
  }

});
