import Ember from 'ember';
import DeploymentRouteMixin from "../mixins/deployment-route-mixin";
import request from 'ic-ajax';

export default Ember.Route.extend(DeploymentRouteMixin, {

  model(params) {
    return this.store.findRecord('deployment', params.deployment_id);
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('satelliteTabRouteName', 'satellite.index');
    controller.set('organizationTabRouteName', 'configure-organization');
    controller.set('lifecycleEnvironmentTabRouteName', 'configure-environment');
    controller.set('model.host_naming_scheme', 'Freeform');
    controller.set('confirmRhevRootPassword', model.get('rhev_root_password'));
    controller.set('confirmRhevEngineAdminPassword', model.get('rhev_engine_admin_password'));
    controller.set('confirmCfmeRootPassword', model.get('cfme_root_password'));
    controller.set('confirmCfmeAdminPassword', model.get('cfme_admin_password'));
    controller.set('confirmOvercloudPassword', model.get('openstack_overcloud_password'));

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
    installDeployment() {
      var self = this;
      var deployment = self.modelFor('deployment');
      var token = Ember.$('meta[name="csrf-token"]').attr('content');

      var controller = this.controllerFor('review/installation');

      if(controller.get('modalOpen')) {
          controller.closeContinueDeployModal();
      }

      controller.set('spinnerTextMessage', 'Building task list');
      controller.set('showSpinner', true);

      request({
          url: '/fusor/api/v21/deployments/' + deployment.get('id') + '/deploy' ,
          type: "PUT",
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "X-CSRF-Token": token,
              "Authorization": "Basic " + self.get('session.basicAuthToken')
          }
          }).then(function(response) {
            var uuid = response.id;
            deployment.set('foreman_task_uuid', uuid);
            deployment.save().then(function () {
              return self.transitionTo('review.progress.overview');
            }, function () {
              controller.set('errorMsg', 'Error in saving UUID of deployment task.');
              controller.set('showErrorMessage', true);
            });
          }, function(error) {
            controller.set('showSpinner', false);
            console.log(error);
            var errorMsg = error.responseText;
            controller.set('errorMsg', errorMsg);
            controller.set('showErrorMessage', true);
            }
          );
    },

    attachSubscriptions() {
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

          request({
              url: url,
              type: "POST",
              headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json",
                  "X-CSRF-Token": token
              }
              }).then(function(response) {
                  console.log('successfully attached ' + item.qtyToAttach + ' subscription for pool ' + item.id);
                  self.send('installDeployment');
              }, function(error) {
                  console.log('error on attachSubscriptions');
                  return self.send('error');
              }
          );

        }
      });
    },

    saveAndCancelDeployment() {
      return this.send('saveDeployment', 'deployments');
    },

    cancelAndDeleteDeployment() {
      var deployment = this.get('controller.model');
      var self = this;
      deployment.destroyRecord().then(function() {
        return self.transitionTo('deployments');
      });
    },

    error(reason) {
      console.log(reason);
      var controller = this.controllerFor('deployment');
      controller.set('errorMsg', reason.responseJSON.error.message);
    },

    refreshModel() {
      console.log('refreshModelOnDeploymentRoute');
      return this.refresh();
    }

  }

});
