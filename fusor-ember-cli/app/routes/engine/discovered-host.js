import Ember from 'ember';
import DiscoveredHostRouteMixin from "../../mixins/discovered-host-route-mixin";

export default Ember.Route.extend(DiscoveredHostRouteMixin, {
  model: function () {
    return this.modelFor('deployment').get('discovered_host').then(function(results) {
        return results;
    });
  },

  deactivate: function() {
    return this.send('saveDeployment', null);
  }

});
