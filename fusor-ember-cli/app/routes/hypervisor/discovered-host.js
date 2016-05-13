import Ember from 'ember';
import DiscoveredHostRouteMixin from "../../mixins/discovered-host-route-mixin";
import request from 'ic-ajax';

export default Ember.Route.extend(DiscoveredHostRouteMixin, {
  model() {
    return this.modelFor('deployment').get('discovered_hosts');
  },

  deactivate() {
    return this.send('saveHyperVisors', null);
  },

  actions: {
    saveHyperVisors(redirectPath) {
      var self = this;
      var deployment = this.modelFor('deployment');
      var hypervisorModelIds = this.controllerFor('hypervisor/discovered-host').get('hypervisorModelIds');
      var token = Ember.$('meta[name="csrf-token"]').attr('content');

      request({
        url: '/fusor/api/v21/deployments/' + deployment.get('id'),
        type: "PUT",
        data: JSON.stringify({'deployment': { 'discovered_host_ids': hypervisorModelIds } }),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
          "Authorization": "Basic " + self.get('session.basicAuthToken')
        }
      }).then(function(response) {
        if (redirectPath) {
          self.transitionTo('rhev-options');
        }
      }, function(error) {
        console.log(error);
      });
    }
  }

});
