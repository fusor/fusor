import Ember from 'ember';
import DeploymentRouteMixin from "../mixins/deployment-route-mixin";

export default Ember.Route.extend(DeploymentRouteMixin, {

  model: function(params) {
    return this.store.findRecord('deployment', params.deployment_id);
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('satelliteTabRouteName', 'satellite.index');
    controller.set('organizationTabRouteName', 'configure-organization');
    controller.set('lifecycleEnvironmentTabRouteName', 'configure-environment');

    // copied from setupController in app/routes/subscriptions/credentials.js
    // to fix bug of Review Tab being disabled on refresh and needing to click
    // on subscriptions to enable it
    // check if org has upstream UUID using Katello V2 API
    var orgID = model.get('organization.id');
    var url = '/katello/api/v2/organizations/' + orgID;
    Ember.$.getJSON(url).then(function(results) {
      if (Ember.isPresent(results.owner_details.upstreamConsumer)) {
        controller.set('organizationUpstreamConsumerUUID', results.owner_details.upstreamConsumer.uuid);
        controller.set('organizationUpstreamConsumerName', results.owner_details.upstreamConsumer.name);
        // if no UUID for deployment, assign it from org UUID
        if (Ember.isBlank(controller.get('model.upstream_consumer_uuid'))) {
          controller.set('model.upstream_consumer_uuid', results.owner_details.upstreamConsumer.uuid);
          controller.set('model.upstream_consumer_name', results.owner_details.upstreamConsumer.name);
        }
      } else {
        controller.set('organizationUpstreamConsumerUUID', null);
        controller.set('organizationUpstreamConsumerName', null);
      }
    });

  },

  actions: {
    installDeployment: function() {
      var self = this;
      var deployment = self.modelFor('deployment');
      var token = Ember.$('meta[name="csrf-token"]').attr('content');

      var controller = this.controllerFor('review/installation');

      controller.set('spinnerTextMessage', 'Building task list');
      controller.set('showSpinner', true);

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
              var uuid = response.id;
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
              var errorMsg = response.responseText;
              controller.set('errorMsg', errorMsg);
              controller.set('showErrorMessage', true);
              reject(response);
            }
        });
      });
    },

    attachSubscriptions: function() {
      var self = this;
      var token = Ember.$('meta[name="csrf-token"]').attr('content');
      var sessionPortal = this.modelFor('subscriptions');
      var consumerUUID = sessionPortal.get('consumerUUID');
      var subscriptions = this.controllerFor('subscriptions/select-subscriptions').get('subscriptionPools');

      var controller = this.controllerFor('review/installation');

      controller.set('buttonDeployDisabled', true);
      controller.set('spinnerTextMessage', 'Attaching Subscriptions in Red Hat Customer Portal');
      controller.set('showSpinner', true);

      subscriptions.forEach(function(item){
        console.log(item);
        console.log('qtyToAttach is');
        console.log(item.get('qtyToAttach'));
        console.log('pool ID is');
        console.log(item.get('id'));
        console.log('isSelectedSubscription is');
        console.log(item.get('isSelectedSubscription'));

        if (item.get('isSelectedSubscription')) {

          // POST /customer_portal/consumers/#{CONSUMER['uuid']}/entitlements?pool=#{POOL['id']}&quantity=#{QUANTITY}
          var url = '/customer_portal/consumers/' + consumerUUID + "/entitlements?pool=" + item.get('id') + "&quantity=" + item.get('qtyToAttach');

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
      var controller = this.controllerFor('deployment');
      controller.set('errorMsg', reason.responseJSON.error.message);
    },

    refreshModel: function(){
      console.log('refreshModelOnDeploymentRoute');
      return this.refresh();
    }

  }

});
