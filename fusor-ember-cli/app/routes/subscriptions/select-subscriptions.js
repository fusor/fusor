import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    // GET /fusor/subscriptions?source=added&deployment_id=ID_OF_DEPLOYMENT
    var deploymentId = this.modelFor('deployment').get('id');
    return this.store.query('subscription', {deployment_id: deploymentId, source: 'added'});
  },

  setupController(controller, model) {
    controller.set('model', model);
    var deployment = this.modelFor('deployment');
    var deploymentId = deployment.get('id');
    var isDisconnected = this.controllerFor('deployment').get('isDisconnected');
    var sessionPortal = this.modelFor('subscriptions').sessionPortal;

    if (!(this.controllerFor('deployment').get('isStarted'))) {
      controller.set('isLoading', true);
      controller.set('errorMsg', null);

      var consumerUUID = this.modelFor('deployment').get('upstream_consumer_uuid');

      var entitlements = this.store.query('entitlement', {uuid: consumerUUID});
      var pools        = this.store.query('pool',        {uuid: consumerUUID});
      var subscriptions = this.store.query('subscription', {deployment_id: deploymentId, source: 'added'});

      return Ember.RSVP.Promise.all([
        entitlements,
        pools,
        subscriptions
      ]).then(results => {
        var entitlementsResults = results[0];
        var allPoolsResults     = results[1];
        var subscriptionResults     = results[2];

        // in case go to this route from URL
        sessionPortal.set('isAuthenticated', true);
        allPoolsResults.forEach(pool => {
          pool.set('qtyAttached', 0); //default for loop

          entitlementsResults.forEach(entitlement => {
            if (entitlement.get('poolId') === pool.get('id')) {
              pool.incrementProperty('qtyAttached', entitlement.get('quantity'));
            }
          });

          //create Fusor::Subscription records if they don't exist
          var matchingSubscription = subscriptionResults.filterBy(
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
            sub.save();
          } else {
            // update quantity_attached is it may have changed since record was created
            matchingSubscription.set('quantity_attached', pool.get('qtyAttached'));
            matchingSubscription.save();
          }

        });
        controller.set('subscriptionEntitlements', Ember.A(results[0]));
        controller.set('subscriptionPools', Ember.A(results[1]));
      }).catch(error => {
        console.debug('route::select-subscriptions::setupController: Main RSVP catch block');
        console.debug(error);
        console.debug('route::select-subscriptions::setupController: Saving session portal...');
        console.debug(sessionPortal);
        return sessionPortal.save().then(() => {
          console.debug('route::select-subscriptions::setupController: Session portal successfully saved');
          console.debug(error);
          controller.set('errorMsg', 'An error occurred while loading subscription data');
          controller.set('showErrorMessage', true);
        }).catch(error => {
          console.debug('route::select-subscriptions::setupController: Session portal save catch');
          console.debug(error);
          controller.set('errorMsg', 'An error occurred while persisting login credentials');
          controller.set('showErrorMessage', true);
        });
      }).finally(() => {
        console.debug('route::select-subscriptions::setupController: finally bringing down spinner');
        controller.set('isLoading', false);
      });
    }
  },

  actions: {
    saveSubscription(pool, qty) {
      // get saved subscriptions and update quantity
      const deployment = this.modelFor('deployment');
      const deploymentId = this.modelFor('deployment').get('id');

      const subProm = this.store.query('subscription', {
        deployment_id: deploymentId, source: 'added'
      })
      .then((subscriptionResults) => {
        const matchingSubscription = subscriptionResults.filterBy(
          'contract_number', pool.get('contractNumber')
        ).get('firstObject');

        if (Ember.isPresent(matchingSubscription)) {
          matchingSubscription.set('quantity_to_add', qty);
          return matchingSubscription.save();
        }
      });

      subProm.then(() => {
        this.set('subProm', null);
      });

      this.set('subProm', subProm);
    },

    willTransition(transition) {
      const subProm = this.get('subProm');
      if(subProm) {
        transition.abort();

        subProm.then(() => {
          this.transitionTo('subscriptions.review-subscriptions');
        });
      }
    },

    error(reason, transition) {
      // bubble up this error event:
      return true;
    }
  }

});
