import Ember from 'ember';

export default Ember.Route.extend({
  activate: function() {
    this.controllerFor('side-menu').set('etherpadName', '52'); //route-rhev-options
  },

  deactivate: function() {
    this.controllerFor('side-menu').set('etherpadName', '');
  }
});
