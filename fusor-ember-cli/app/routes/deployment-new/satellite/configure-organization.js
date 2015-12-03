import Ember from 'ember';
import DeploymentNewSatelliteRouteMixin from "../../../mixins/deployment-new-satellite-route-mixin";

export default Ember.Route.extend(DeploymentNewSatelliteRouteMixin, {

  model() {
    return this.modelFor('deployment-new').get('organization');
  },

  setupController(controller, model) {
    var self = this;
    controller.set('model', model);
    controller.set('showAlertMessage', false);
    this.store.findRecord('organization', 1).then(function(result) {
        controller.set('defaultOrg', result);
        controller.set('model', result);
        controller.set('selectedOrganization', result);
        self.modelFor('deployment-new').set('organization', result);
    });
  }

});
