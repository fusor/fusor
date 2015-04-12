import Ember from 'ember';
import DeploymentRouteMixin from "../mixins/deployment-route-mixin";

export default Ember.Route.extend(DeploymentRouteMixin, {

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

      // change button text to "Deploying ..." and disable it
      this.controllerFor('review.installation').set('buttonDeployTitle', 'Deploying ...');
      this.controllerFor('review.installation').set('buttonDeployDisabled', true);

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
              self.controllerFor('review.installation').set('buttonDeployTitle', 'Deployed');
              return self.transitionTo('review.progress');
            },

            error: function(response){
              console.log(response);
              var errorMsg = response.responseJSON.displayMessage;
              self.controllerFor('review.installation').set('errorMsg', errorMsg);
              self.controllerFor('review.installation').set('showErrorMessage', true);
              self.controllerFor('review.installation').set('buttonDeployTitle', 'Deploy');
              self.controllerFor('review.installation').set('buttonDeployDisabled', false);
              reject(response);
            }
        });
      });
    }
  }

});
