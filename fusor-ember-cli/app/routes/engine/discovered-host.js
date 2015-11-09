import Ember from 'ember';
import DiscoveredHostRouteMixin from "../../mixins/discovered-host-route-mixin";

export default Ember.Route.extend(DiscoveredHostRouteMixin, {
  model() {
    return this.modelFor('deployment').get('discovered_host');
  },

  deactivate() {
    return this.send('saveDeployment', null);
  }

});
