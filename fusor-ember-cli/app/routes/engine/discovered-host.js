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
      controller.set('isLoadingHosts', false);
    });
  },

  deactivate: function() {
    return this.send('saveDeployment', null);
  },

  // TODO - make mixin - same on route hypervisor/discovered-host
  actions: {
    refreshDiscoveredHosts: function(){
      console.log('refresh allDiscoveredHosts');
      var controller = this.get('controller');
      controller.set('isLoadingHosts', true);
      this.store.find('discovered-host').then(function(results) {
        controller.set('allDiscoveredHosts', results);
        controller.set('isLoadingHosts', false);
      });

    }
  }

});
