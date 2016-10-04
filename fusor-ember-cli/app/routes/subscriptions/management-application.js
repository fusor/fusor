import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    var self = this;
    var deployment = this.modelFor('deployment');
    var sessionPortal = this.modelFor('subscriptions').sessionPortal;
    var ownerKey = sessionPortal.get('ownerKey');

    // Use owner key to get consumers (subscription application manangers)
    // GET /customer_portal/owners/#{OWNER['key']}/consumers?type=satellite
    if (deployment.get('isStarted') &&
        deployment.get('upstream_consumer_uuid') &&
        deployment.get('upstream_consumer_name')) {

      var managementApp = Ember.Object.create({
        id: deployment.get('upstream_consumer_uuid'),
        name: deployment.get('upstream_consumer_name')
      });

      return Ember.A([managementApp]);
    } else {
      return this.store.query('management-application', {
        owner_key: ownerKey
      }).then(function(results) {
        // in case go to this route from URL
        sessionPortal.set('isAuthenticated', true);
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
    controller.set('newSatelliteName', null);
    controller.set('showAlertMessage', false);
    controller.set('showWaitingMessage', false);
    controller.set('showErrorMessage', false);
    controller.set('errorMsg', null);

    var sessionPortal = this.modelFor('subscriptions').sessionPortal;
    var deployment = this.modelFor('deployment');
    var upstream_consumer_uuid = deployment.get('upstream_consumer_uuid');

    if (deployment.get('isStarted')) {
      sessionPortal.set('consumerUUID', upstream_consumer_uuid);
      controller.set('sessionPortal', sessionPortal);
    } else if (Ember.isPresent(sessionPortal.get('consumerUUID'))) {
      // set controller state. If this hasn't been chosen before, consumerUUID
      // will correctly be set to null, and there will not be a default selection
      sessionPortal.set('consumerUUID', controller.get('upstreamConsumerUuid'));
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
    willTransition(transition) {
      if (this.modelFor('deployment').get('isNotStarted')) {
        this.saveSma().catch(err => console.log(err));
      }

      return true;
    },

    error(reason, transition) {
      // bubble up this error event:
      return true;
    }
  },

  saveSma() {
    let controller = this.get('controller');
    let deployment = this.modelFor('deployment');
    let deploymentId = deployment.get('id');
    let consumerUUID = deployment.get('upstream_consumer_uuid');
    let isDisconnected = this.controllerFor('deployment').get('isDisconnected');

    controller.set('isLoading', true);
    controller.set('errorMsg', null);


    return Ember.RSVP.hash({
      entitlements: this.store.query('entitlement', {uuid: consumerUUID}),
      pools: this.store.query('pool', {uuid: consumerUUID}),
      subscriptions: this.store.query('subscription', {
        deployment_id: deploymentId,
        source: 'added',
        cachebust: Date.now().toString() // Force a non-cached response
      })
    }).then(results => {

      let promises = [];

      results.pools.forEach(pool => {
        pool.set('qtyAttached', 0); //default for loop

        results.entitlements.forEach(entitlement => {
          if (entitlement.get('poolId') === pool.get('id')) {
            pool.incrementProperty('qtyAttached', entitlement.get('quantity'));
          }
        });

        //create Fusor::Subscription records if they don't exist
        var matchingSubscription = results.subscriptions.filterBy(
          'contract_number', pool.get('contractNumber')).get('firstObject');
        if (Ember.isBlank(matchingSubscription)) {
          var sub = this.store.createRecord('subscription', {
            'contract_number': pool.get('contractNumber'),
            'product_name': pool.get('productName'),
            'quantity_to_add': 0,
            'quantity_attached': pool.get('qtyAttached'),
            'source': 'added',
            'start_date': pool.get('startDate'),
            'end_date': pool.get('endDate'),
            'total_quantity': pool.get('quantity'),
            'deployment': deployment
          });
          promises.push(sub.save());
        } else {
          // update quantity_attached is it may have changed since record was created
          matchingSubscription.set('quantity_attached', pool.get('qtyAttached'));
          promises.push(matchingSubscription.save());
        }
      });

      return Ember.RSVP.all(promises);
    });
  }
});
