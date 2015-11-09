import Ember from 'ember';

export default Ember.Mixin.create({

  setupController(controller, model) {
    controller.set('model', model);
    if (this.modelFor('deployment').get('isNotStarted')) {
        controller.set('isLoadingHosts', true);
        this.store.findAll('discovered-host').then(function(results) {
          controller.set('allDiscoveredHosts', results.filterBy('is_discovered', true));
          controller.set('isLoadingHosts', false);
        });
    }
  },

  actions: {
    refreshDiscoveredHosts() {
      console.log('refresh allDiscoveredHosts');
      var controller = this.get('controller');
      controller.set('isLoadingHosts', true);
      this.store.findAll('discovered-host').then(function(results) {
          controller.set('allDiscoveredHosts', results.filterBy('is_discovered', true));
          controller.set('isLoadingHosts', false);
      });
    }
  }

});
