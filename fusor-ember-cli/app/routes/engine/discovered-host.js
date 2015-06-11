import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.modelFor('deployment').get('discovered_host');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('isLoadingHosts', true);
    var self = this;
    this.store.find('discovered-host').then(function(results) {
      controller.set('allDiscoveredHosts', results);
      self.modelFor('deployment').get('discovered_hosts').then(function(results2) {
        controller.set('selectedHypervisors', results2);
        controller.set('isLoadingHosts', false);
      });
    });
  },

  deactivate: function() {
    return this.send('saveDeployment', null);
  },

});
