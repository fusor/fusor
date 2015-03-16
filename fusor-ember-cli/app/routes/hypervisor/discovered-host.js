import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.modelFor('deployment').get('discovered_hosts');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('allDiscoveredHosts', this.store.find('discovered-host'));
  },

  deactivate: function() {
    var model = this.modelFor('deployment')
    return this.send('saveHyperVisors');
  },

  actions: {
    saveHyperVisors: function() {
      var self = this;
      var dep = this.modelFor('deployment');
      //TODO - now working
      // this.store.find('discovered-host').then(function(discoveredHostsToAdd) {
      //   dep.get('discovered_hosts').then(function(discoveredHosts) {
      //     discoveredHosts.addObjects(discoveredHostsToAdd);
      //     dep.save().then(function() {
      //       discoveredHostsToAdd.save();
      //     });
      //   });
      // });
    }
  }

});
