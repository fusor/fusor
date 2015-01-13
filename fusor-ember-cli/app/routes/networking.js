import Ember from 'ember';

export default Ember.Route.extend({
  activate: function() {
    this.controllerFor('side-menu').set('etherpadName', '51'); //route-rhev-networking
  },

  deactivate: function() {
    this.controllerFor('side-menu').set('etherpadName', '');
  }
});
