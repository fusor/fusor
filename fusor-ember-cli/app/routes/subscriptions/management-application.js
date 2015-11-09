import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    var self = this;
    var deployment = this.modelFor('deployment');
    var sessionPortal = this.modelFor('subscriptions');
    var ownerKey = sessionPortal.get('ownerKey');
    // Use owner key to get consumers (subscription application manangers)
    // GET /customer_portal/owners/#{OWNER['key']}/consumers?type=satellite
    if (deployment.get('isStarted') && deployment.get('upstream_consumer_uuid') && deployment.get('upstream_consumer_name')) {
        var managementApp = Ember.Object.create({id: deployment.get('upstream_consumer_uuid'),
                                                 name: deployment.get('upstream_consumer_name')});
        return Ember.A([managementApp]);
    } else {
        return this.store.query('management-application', {owner_key: ownerKey}).then(function(results) {
            sessionPortal.set('isAuthenticated', true); // in case go to this route from URL
            sessionPortal.save();
            return results;
          }, function(results) {
             console.log(results);
             sessionPortal.set('isAuthenticated',false);
             sessionPortal.save().then(function() {
                self.controllerFor('subscriptions.credentials').setProperties({
                                                                   'showErrorMessage': true,
                                                                   'errorMsg': 'You are not currently logged in. Please log in below.'
                                                                 });
                return self.transitionTo('subscriptions.credentials');
             });
        });
    }
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('showManagementApplications', true);

    var sessionPortal = this.modelFor('subscriptions');
    var deployment = this.modelFor('deployment');
    var upstream_consumer_uuid = deployment.get('upstream_consumer_uuid');

    if (deployment.get('isStarted')) {
      sessionPortal.set('consumerUUID', upstream_consumer_uuid);
      controller.set('sessionPortal', sessionPortal);
    } else {
      // check if org has upstream UUID using Katello V2 API
      var orgID = this.modelFor('deployment').get('organization.id');
      var url = '/katello/api/v2/organizations/' + orgID;
      Ember.$.getJSON(url).then(function(results) {
          if (Ember.isPresent(results.owner_details.upstreamConsumer)) {
            sessionPortal.set('consumerUUID', results.owner_details.upstreamConsumer.uuid);
            sessionPortal.save();
            controller.set('sessionPortal', sessionPortal);
            deployment.set('upstream_consumer_uuid', results.owner_details.upstreamConsumer.uuid);
            deployment.set('upstream_consumer_name', results.owner_details.upstreamConsumer.name);
          } else {
            // nullify sessionPortal.consumerUUID since it's probably a different deployment
            sessionPortal.set('consumerUUID', null);
          }
        }, function(results) {
          // also nullify sessionPortal.consumerUUID in case there was an error
          sessionPortal.set('consumerUUID', null);
        });
    }
  },

  deactivate() {
    return this.send('saveDeployment', null);
  },

  actions: {
      error(reason, transition) {
        // bubble up this error event:
        return true;
      }
  }

});
