import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
      var deploymentId = this.modelFor('deployment').get('id');
      return Ember.RSVP.hash({
          nodes: this.store.find('node', {deployment_id: deploymentId}),
          profiles: this.store.find('flavor', {deployment_id: deploymentId}),
          bmDeployKernelImage: Ember.$.getJSON('/fusor/api/openstack/deployments/' + deploymentId + '/images/show_by_name/bm-deploy-kernel'),
          bmDeployRamdiskImage: Ember.$.getJSON('/fusor/api/openstack/deployments/' + deploymentId + '/images/show_by_name/bm-deploy-ramdisk')
      });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('showAlertMessage', false);
  },

  deactivate: function() {
    return this.send('saveDeployment', null);
  }

});
