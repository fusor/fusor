import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.modelFor('deployment').get('subscriptions');
  },

  setupController(controller, model) {
    controller.set('model', model);
    var self = this;
    var isDisconnected = this.controllerFor('deployment').get('isDisconnected');

    if (!(this.controllerFor('deployment').get('isStarted'))) {
        controller.set('isLoading', true);

        var consumerUUID = this.modelFor('deployment').get('upstream_consumer_uuid');

        var entitlements = this.store.query('entitlement', {uuid: consumerUUID});
        var pools        = this.store.query('pool',        {uuid: consumerUUID});

        return Ember.RSVP.Promise.all([entitlements, pools]).then(function(results) {
          var entitlementsResults = results[0];
          var allPoolsResults     = results[1];
          self.modelFor('subscriptions').set('isAuthenticated', true); // in case go to this route from URL
          allPoolsResults.forEach(function(pool){
              pool.set('qtyAttached', 0); //default for loop
              entitlementsResults.forEach(function(entitlement) {
                if (entitlement.get('poolId') === pool.get('id')) {
                  pool.incrementProperty('qtyAttached', entitlement.get('quantity'));
                }
              });
          });
          controller.set('subscriptionEntitlements', Ember.A(results[0]));
          controller.set('subscriptionPools', Ember.A(results[1]));
          return controller.set('isLoading', false);
        }, function() {
             self.modelFor('subscriptions').set('isAuthenticated');
             self.modelFor('subscriptions').save().then(function() {
               self.controllerFor('subscriptions.credentials').setProperties({
                                                                   'showErrorMessage': true,
                                                                   'errorMsg': 'You are not currently logged in. Please log in below.'
                                                                 });
               return self.transitionTo('subscriptions.credentials');
             });
        });
    }
  },

  deactivate() {
    // uncommeting causes inFlight issues
    // return this.send('saveSubscriptions', null);
  },

  actions: {

    saveSubscriptions(redirectPath) {
      var self = this;
      var deployment = this.modelFor('deployment');
      var subscriptionPools = this.controllerFor('subscriptions/select-subscriptions').get('subscriptionPools');
      var hasSubscriptionPools = this.controllerFor('subscriptions/select-subscriptions').get('hasSubscriptionPools');

      if (hasSubscriptionPools) {
          // remove existing subscriptions
          deployment.get('subscriptions').then(function(results) {
              results.forEach(function(sub) {
                  sub.deleteRecord();
                  sub.save();
              });

              deployment.save().then(function () {

                  // add subscriptions to deployment
                  subscriptionPools.forEach(function(pool) {
                    if (pool.get('isSelectedSubscription')) {
                        var sub = self.store.createRecord('subscription', {'contract_number': pool.get('contractNumber'),
                                                                           'product_name': pool.get('productName'),
                                                                           'quantity_attached': pool.get('qtyToAttach'),
                                                                           'deployment': deployment
                                                                          });
                        sub.save();
                    }
                  });

                  if (redirectPath) {
                    return self.transitionTo(redirectPath);
                  }
              });
          });
      } else {
          return self.transitionTo(redirectPath);
      }

    },

    error(reason, transition) {
      // bubble up this error event:
      return true;
    }
  }

});
