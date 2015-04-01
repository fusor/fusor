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

  actions: {
    installDeployment: function(options) {
      var self = this;
      var deployment = this.modelFor('deployment');
      var token = $('meta[name="csrf-token"]').attr('content');

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
            url: '/fusor/api/v21/deployments/' + deployment.get('id') + '/deploy' ,
            type: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRF-Token": token,
                "Authorization": "Basic " + self.get('session.basicAuthToken')
            },
            success: function(response) {
              resolve(response);
              self.controllerFor('review').set('disableTabProgress', false);
              return self.transitionTo('review.progress');
            },

            error: function(response){
              reject(response);
            }
        });
      });
    }
  }

});
