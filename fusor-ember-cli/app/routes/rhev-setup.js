import Ember from 'ember';

export default Ember.Route.extend({
  activate: function() {
    this.controllerFor('side-menu').set('etherpadName', '45'); //route-rhev-setup
  },

  deactivate: function() {
    this.controllerFor('side-menu').set('etherpadName', '');
  }
});
