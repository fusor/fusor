import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.store.find('subnet');
  },

  activate: function() {
    this.controllerFor('side-menu').set('etherpadName', '54');
  },

  deactivate: function() {
    this.controllerFor('side-menu').set('etherpadName', '');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('trafficTypes', this.store.find('traffic-type'));
  },


});
