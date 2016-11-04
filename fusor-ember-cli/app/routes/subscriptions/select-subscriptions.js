import Ember from 'ember';
import ResetsVerticalScroll from '../../mixins/resets-vertical-scroll';
import LoadUpdatedSubscriptions from '../../mixins/load-updated-subscriptions-mixin';

export default Ember.Route.extend(ResetsVerticalScroll, LoadUpdatedSubscriptions, {

  model() {
    // GET /fusor/subscriptions?source=added&deployment_id=ID_OF_DEPLOYMENT
    var deploymentId = this.modelFor('deployment').get('id');
    return this.store.query('subscription', {deployment_id: deploymentId, source: 'added'});
  },

  setupController(controller, model) {
    controller.set('model', model);
    var deployment = this.modelFor('deployment');
    var isDisconnected = this.controllerFor('deployment').get('isDisconnected');
    var sessionPortal = this.modelFor('subscriptions').sessionPortal;
    var consumerUUID = this.modelFor('deployment').get('upstream_consumer_uuid');

    if (isDisconnected || this.controllerFor('deployment').get('isStarted')) {
      return;
    }

    controller.set('isLoading', true);
    controller.set('errorMsg', null);

    this.loadUpdatedSubscriptionInfo(deployment, consumerUUID).then(results => {
      let entitlementsResults = results.entitlements;
      let allPoolsResults = results.pools;
      let subscriptionResults = results.subscriptions;

      // in case go to this route from URL
      sessionPortal.set('isAuthenticated', true);
      allPoolsResults.forEach(pool => {
        pool.set('qtyAttached', 0); //default for loop

        entitlementsResults.forEach(entitlement => {
          if (entitlement.get('poolId') === pool.get('id')) {
            pool.incrementProperty('qtyAttached', entitlement.get('quantity'));
          }
        });

      });
      controller.set('subscriptionEntitlements', entitlementsResults);
      controller.set('subscriptionPools', allPoolsResults);
      controller.set('model', subscriptionResults);
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
