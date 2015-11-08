import Ember from 'ember';
import DeploymentNewSatelliteRouteMixin from "../../../mixins/deployment-new-satellite-route-mixin";

export default Ember.Route.extend(DeploymentNewSatelliteRouteMixin, {

  model: function () {
    return this.modelFor('deployment-new').get('organization');
  },

  setupController: function(controller, model) {
    var self = this;
    controller.set('model', model);
    controller.set('showAlertMessage', false);
    this.store.findAll('organization').then(function(results) {
      controller.set('organizations', results);
      if (results.get('length') === 1) {
        var defaultOrg = results.get('firstObject');
        controller.set('model', defaultOrg);
        controller.set('selectedOrganization', defaultOrg);
        self.modelFor('deployment-new').set('organization', defaultOrg);
      }
    });
  }

});
