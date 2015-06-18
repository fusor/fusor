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
    installDeployment: function() {
      var self = this;
      var deployment = this.controllerFor('deployment');
      var token = $('meta[name="csrf-token"]').attr('content');

      var controller = this.controllerFor('review/installation');

      controller.set('spinnerTextMessage', 'Building task list');
      controller.set('showSpinner', true);

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
                controller.set('errorMsg', 'Error in saving UUID of deployment task.');
                controller.set('showErrorMessage', true);
              });
            },

            error: function(response){
              controller.set('showSpinner', false);
              console.log(response);
              var errorMsg = response.responseJSON.displayMessage;
              controller.set('errorMsg', errorMsg);
              controller.set('showErrorMessage', true);
              reject(response);
            }
        });
      });
    },

    attachSubscriptions: function() {
      var self = this;
      var token = $('meta[name="csrf-token"]').attr('content');
      var sessionPortal = this.modelFor('subscriptions');
      var consumerUUID = sessionPortal.get('consumerUUID');
      var subscriptions = this.controllerFor('subscriptions/select-subscriptions').get('model');

      var controller = this.controllerFor('review/installation');

      controller.set('buttonDeployDisabled', true);
      controller.set('spinnerTextMessage', 'Attaching Subscriptions in Red Hat Customer Portal');
      controller.set('showSpinner', true);

      subscriptions.forEach(function(item){
        console.log(item);
        console.log('qtyToAttach is');
        console.log(item.qtyToAttach);
        console.log('pool ID is');
        console.log(item.id);
        console.log('isSelectedSubscription is');
        console.log(item.isSelectedSubscription);

        if (item.isSelectedSubscription) {

          // POST /customer_portal/consumers/#{CONSUMER['uuid']}/entitlements?pool=#{POOL['id']}&quantity=#{QUANTITY}
          var url = '/customer_portal/consumers/' + consumerUUID + "/entitlements?pool=" + item.id + "&quantity=" + item.qtyToAttach;

          return new Ember.RSVP.Promise(function (resolve, reject) {
            Ember.$.ajax({
                url: url,
                type: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-CSRF-Token": token,
                },

                success: function() {
                  console.log('successfully attached ' + item.qtyToAttach + ' subscription for pool ' + item.id);
                  self.send('installDeployment');
                },

                error: function(){
                  console.log('error on attachSubscriptions');
                  return self.send('error');
                }
            });
          });

        }
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

    error: function(reason) {
      console.log(reason);
      alert(reason.statusText);
    },

  }

});
