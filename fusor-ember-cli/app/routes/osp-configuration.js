import Ember from 'ember';

export default Ember.Route.extend({
  activate: function() {
    this.controllerFor('side-menu').set('etherpadName', '56'); //route-openstack-services-config
  },

  deactivate: function() {
    this.controllerFor('side-menu').set('etherpadName', '');
  }

});
