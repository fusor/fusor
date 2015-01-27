import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.store.find('discovered-host');
  },
  activate: function() {
    this.controllerFor('side-menu').set('etherpadName', '46'); //route-rhev-hypervisor
  },

  deactivate: function() {
    this.controllerFor('side-menu').set('etherpadName', '');
  }
});
