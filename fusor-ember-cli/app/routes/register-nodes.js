import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
      return Ember.RSVP.hash({
          nodes: this.store.find('node'),
          profiles: this.store.find('flavor'),
          bmDeployKernelImage: Ember.$.getJSON('/fusor/api/openstack/images/show_by_name/bm-deploy-kernel'),
          bmDeployRamdiskImage: Ember.$.getJSON('/fusor/api/openstack/images/show_by_name/bm-deploy-ramdisk')

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
