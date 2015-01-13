import Ember from 'ember';

export default Ember.Route.extend({
  activate: function() {
    this.controllerFor('side-menu').set('etherpadName', '41'); //route-satellite
  },

  deactivate: function() {
    this.controllerFor('side-menu').set('etherpadName', '');
  }
});
