import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.modelFor('deployment').get('discovered_hosts');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('isLoadingHosts', true);
    this.store.find('discovered-host').then(function(results) {
      controller.set('allDiscoveredHosts', results);
      controller.set('isLoadingHosts', false);
    });
  },

  deactivate: function() {
    return this.send('saveHyperVisors', null);
  },

  actions: {
    saveHyperVisors: function(redirectPath) {
      var self = this;
      var deployment = this.modelFor('deployment');
      var hypervisorModelIds = this.controllerFor('hypervisor/discovered-host').get('hypervisorModelIds');
      var token = $('meta[name="csrf-token"]').attr('content');

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
            url: '/fusor/api/v21/deployments/' + deployment.get('id'),
            type: "PUT",
            data: JSON.stringify({'deployment': { 'discovered_host_ids': hypervisorModelIds } }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRF-Token": token,
                "Authorization": "Basic " + self.get('session.basicAuthToken')
            },
            success: function(response) {
              resolve(response);
              if (redirectPath) {
                self.transitionTo('rhev-options');
              }
            },

            error: function(response){
              reject(response);
            }
        });
      });
    },

    // TODO - make mixin - same on route engine/discovered-host
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
