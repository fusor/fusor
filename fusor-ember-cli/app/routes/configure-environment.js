import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return this.store.find('environment');
  },

  activate: function() {
    this.controllerFor('side-menu').set('etherpadName', '44'); //route-configure-environment
  },

  deactivate: function() {
    this.controllerFor('side-menu').set('etherpadName', '');
  }

});
