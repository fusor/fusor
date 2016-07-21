import Ember from 'ember';
import DiscoveredHostRouteMixin from '../../mixins/discovered-host-route-mixin';
import NeedsDiscoveredHostsAjax from '../../mixins/needs-discovered-hosts-ajax';

export default Ember.Route.extend(DiscoveredHostRouteMixin, NeedsDiscoveredHostsAjax, {
  model() {
    return this.modelFor('deployment').get('discovered_hosts');
  },

  deactivate() {
    return this.send('saveHyperVisors', null);
  },

  actions: {
    saveHyperVisors(redirectPath) {
      var deployment = this.modelFor('deployment');
      var hypervisorModelIds = this.controllerFor('hypervisor/discovered-host')
        .get('hypervisorModelIds');

      this.postDiscoveredHostIds(deployment, hypervisorModelIds).then(() => {
        if (redirectPath) {
          this.transitionTo('rhev-options');
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }
});
