import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.modelFor('deployment').get('discovered_host');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('allDiscoveredHosts', this.store.find('discovered-host'));
  },

  deactivate: function() {
    return this.send('saveDeployment', null);
  },

});
