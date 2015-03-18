import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import DeploymentRouteMixin from "../mixins/deployment-route-mixin";

export default Ember.Route.extend(AuthenticatedRouteMixin, DeploymentRouteMixin, {

  model: function(params) {
    return this.store.find('deployment', params.deployment_id);
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('satelliteTabRouteName', 'satellite.index');
    controller.set('organizationTabRouteName', 'configure-organization');
    controller.set('lifecycleEnvironmentTabRouteName', 'configure-environment');
  },

});
