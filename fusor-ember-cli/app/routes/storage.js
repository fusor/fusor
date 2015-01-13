import Ember from 'ember';

export default Ember.Route.extend({
  activate: function() {
    this.controllerFor('side-menu').set('etherpadName', '50'); //route-rhev-storage
  },

  deactivate: function() {
    this.controllerFor('side-menu').set('etherpadName', '');
  }
});
