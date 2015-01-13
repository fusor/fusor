import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('organizations', this.store.find('organization'));
    controller.set('locations', this.store.find('location'));
    controller.set('environments', this.store.find('environment'));
    controller.set('hostgroups', this.store.find('hostgroup'));
  },
  activate: function() {
    this.controllerFor('side-menu').set('etherpadName', '48'); //route-engine-new-host
  },

  deactivate: function() {
    this.controllerFor('side-menu').set('etherpadName', '');
  }
});
