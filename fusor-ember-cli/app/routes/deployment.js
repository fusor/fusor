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
    if (Ember.isBlank(model.get('lifecycle_environment_id'))) {
      controller.set('useDefaultOrgViewForEnv', true);
    }
  },

  actions: {
    installDeployment: function(options) {
      var self = this;
      var deployment = this.controllerFor('deployment');
      var token = $('meta[name="csrf-token"]').attr('content');

      // change button text to "Deploying ..." and disable it
      this.controllerFor('review.installation').set('buttonDeployTitle', 'Deploying ...');
      this.controllerFor('review.installation').set('buttonDeployDisabled', true);

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
            url: '/fusor/api/v21/deployments/' + deployment.get('id') + '/deploy' ,
            type: "PUT",
            data: JSON.stringify({'skip_content': deployment.get('skipContent') }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRF-Token": token,
                "Authorization": "Basic " + self.get('session.basicAuthToken')
            },
            success: function(response) {
              resolve(response);
              var uuid = response.id;
              var deployment = self.modelFor('deployment');
              deployment.set('foreman_task_uuid', uuid);
              deployment.save().then(function () {
                return self.transitionTo('review.progress.overview');
              }, function () {
                self.controllerFor('review.installation').set('errorMsg', 'Error is saving UUID of deployment task.');
                self.controllerFor('review.installation').set('showErrorMessage', true);
                self.controllerFor('review.installation').set('buttonDeployTitle', 'Deploy');
                self.controllerFor('review.installation').set('buttonDeployDisabled', false);
              })
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
    },

    saveAndCancelDeployment: function() {
      return this.send('saveDeployment', 'deployments');
    },

    cancelAndDeleteDeployment: function() {
      var deployment = this.get('controller.model');
      var self = this;
      deployment.destroyRecord().then(function() {
        return self.transitionTo('deployments');
      });
    },

    loginCredentials: function(options) {
      var self = this;
      var deployment = this.controllerFor('deployment');
      var token = $('meta[name="csrf-token"]').attr('content');

      // change button text to "Deploying ..." and disable it
      this.controllerFor('subscriptions.credentials').set('buttonLoginTitle', 'Logging in ...');
      this.controllerFor('subscriptions.credentials').set('disableCredentialsNext', true);

      return new Ember.RSVP.Promise(function (resolve, reject) {
        Ember.$.ajax({
            url: '/fusor/api/v21/deployments/' + deployment.get('id'),
            type: "GET",
            //data: JSON.stringify({'skip_content': deployment.get('skipContent') }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRF-Token": token,
                "Authorization": "Basic " + self.get('session.basicAuthToken')
            },
            success: function(response) {
              resolve(response);
              //var uuid = response.id;
              var deployment = self.modelFor('deployment');
              // deployment.set('foreman_task_uuid', uuid);
              // deployment.save().then(function () {
              //   return self.transitionTo('review.progress.overview');
              // }, function () {
                self.controllerFor('subscriptions.credentials').set('showErrorMessage', false);
                self.controllerFor('subscriptions.credentials').set('buttonLoginTitle', 'Logged In');
                self.controllerFor('subscriptions.credentials').set('buttonDeployDisabled', true);
                self.transitionTo('subscriptions.management-application');
              //})
            },

            error: function(response){
              console.log(response);
              var errorMsg = response.responseJSON.displayMessage;
              self.controllerFor('subscriptions.credentials').set('errorMsg', errorMsg);
              self.controllerFor('subscriptions.credentials').set('showErrorMessage', true);
              self.controllerFor('subscriptions.credentials').set('buttonDeployTitle', 'Deploy');
              self.controllerFor('subscriptions.credentials').set('buttonDeployDisabled', false);
              reject(response);
            }
        });
      });
    },


  }

});
