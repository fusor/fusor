import Ember from 'ember';
import DeploymentRouteMixin from "../mixins/deployment-route-mixin";

export default Ember.Route.extend(DeploymentRouteMixin, {

  model: function () {
      return Ember.RSVP.hash({
          plan: this.store.find('deployment-plan', 'overcloud'),
          images: this.store.find('image'),
          nodes: this.store.find('node'),
          profiles: this.store.find('flavor')
      });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
  }
});
