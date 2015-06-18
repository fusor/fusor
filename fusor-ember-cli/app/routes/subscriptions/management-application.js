import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    var self = this;
    var sessionPortal = this.modelFor('subscriptions');
    var ownerKey = sessionPortal.get('ownerKey');
    // Use owner key to get consumers (subscription application manangers)
    // GET /customer_portal/owners/#{OWNER['key']}/consumers?type=satellite
    var url = ('/customer_portal/owners/' + ownerKey + '/consumers?type=satellite');

    return $.getJSON(url).then(function(results) {
        sessionPortal.set('isAuthenticated', true); // in case go to this route from URL
        sessionPortal.save();
        return results;
      }, function() {
         sessionPortal.set('isAuthenticated',false);
         sessionPortal.save().then(function() {
            self.controllerFor('subscriptions.credentials').setProperties({
                                                               'showErrorMessage': true,
                                                               'errorMsg': 'You are not currently logged in. Please log in below.'
                                                             });
            return self.transitionTo('subscriptions.credentials');
         });
      }
    );

  },

  setupController: function(controller, model) {
    controller.set('model', model);

    var sessionPortal = this.modelFor('subscriptions');
    var upstream_consumer_uuid = this.modelFor('deployment').get('upstream_consumer_uuid');
    if (upstream_consumer_uuid) {
      sessionPortal.set('consumerUUID', upstream_consumer_uuid);
      controller.set('sessionPortal', sessionPortal);
    } else {
      // check if org has upstream UUID using Katello V2 API
      var orgID = this.modelFor('deployment').get('organization.id');
      var url = '/katello/api/v2/organizations/' + orgID;
      $.getJSON(url).then(function(results) {
          if (Ember.isPresent(results.owner_details.upstreamConsumer)) {
            sessionPortal.set('consumerUUID', results.owner_details.upstreamConsumer.uuid);
            sessionPortal.save();
            controller.set('sessionPortal', sessionPortal);
            controller.set('upstream_consumer_uuid', results.owner_details.upstreamConsumer.uuid);
            controller.set('upstream_consumer_name', results.owner_details.upstreamConsumer.name);
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

  deactivate: function() {
    return this.send('saveDeployment', null);
  },

  actions: {
      error: function(reason, transition) {
        // bubble up this error event:
        return true;
      }
  }


});
