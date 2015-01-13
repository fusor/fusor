import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('environments', this.store.find('environment'));
    controller.set('newenvs', this.store.find('newenv'));
  },
  activate: function() {
    this.controllerFor('side-menu').set('etherpadName', '44'); //route-configure-environment
  },

  deactivate: function() {
    this.controllerFor('side-menu').set('etherpadName', '');
  }

});
