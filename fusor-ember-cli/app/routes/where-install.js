import Ember from 'ember';

export default Ember.Route.extend({
  activate: function() {
    this.controllerFor('side-menu').set('etherpadName', '57');
  },

  deactivate: function() {
    this.controllerFor('side-menu').set('etherpadName', '');
  }
});
