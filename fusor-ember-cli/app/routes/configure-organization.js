import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('organization');
  },

  activate: function() {
    this.controllerFor('side-menu').set('etherpadName', '43'); //route-configure-organization
  },

  deactivate: function() {
    this.controllerFor('side-menu').set('etherpadName', '');
  }
});
