import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.modelFor('deployment');
  },

  setupController(controller, model) {
    controller.set('model', model);
    if (Ember.isBlank(controller.get('model.openstack_overcloud_interface'))) {
      controller.set('model.openstack_overcloud_interface', 'eth1');
    }
  }

});
