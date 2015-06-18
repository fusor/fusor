import Ember from 'ember';
import DeploymentRouteMixin from "../mixins/deployment-route-mixin";

export default Ember.Route.extend(DeploymentRouteMixin, {
  model: function () {
      return {
	  plan: this.store.find('deployment-plan', 'overcloud'),
      };
  },

  setupController: function(controller, model) {
    controller.set('model', model);
  },

});
