import Ember from 'ember';
import DeploymentNewSatelliteRouteMixin from "../../../mixins/deployment-new-satellite-route-mixin";

export default Ember.Route.extend(DeploymentNewSatelliteRouteMixin, {

  model: function () {
    return this.modelFor('deployment-new').get('organization');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    var organizations = this.store.find('organization');
    controller.set('organizations', organizations);
  },

});
