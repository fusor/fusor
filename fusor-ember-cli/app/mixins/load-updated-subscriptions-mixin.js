import Ember from 'ember';

export default Ember.Mixin.create({

  loadUpdatedSubscriptionInfo(deployment, consumerUUID) {
    let deploymentId = deployment.get('id');

    if (deployment.get('is_disconnected')) {
      return Ember.RSVP.hash({
        entitlements: [],
        pools: [],
        subscriptions: this.store.query('subscription', {
          deployment_id: deploymentId,
          source: 'added',
          cachebust: Date.now().toString() // Force a non-cached response
        })
      });
    }

    return Ember.RSVP.hash({
      entitlements: this.store.query('entitlement', {uuid: consumerUUID}),
      pools: this.store.query('pool', {uuid: consumerUUID}),
      subscriptions: this.store.query('subscription', {
        deployment_id: deploymentId,
        source: 'added',
        cachebust: Date.now().toString() // Force a non-cached response
      })
    }).then(results => {
      let subscriptions = [];

      results.subscriptions.forEach(subscription => {
        // increment as we encounter entitlements
        subscription.set('quantity_attached', 0);
        subscriptions.push(subscription);
      });

      results.entitlements.forEach(entitlement => {
        let matchingSub = subscriptions.findBy('contract_number', entitlement.get('contractNumber'));
        if (Ember.isEmpty(matchingSub)) {
          matchingSub = this.createSubscription(entitlement, deployment);
          subscriptions.push(matchingSub);
        }

        matchingSub.incrementProperty('quantity_attached', entitlement.get('quantity'));

        let qtyAvailableToAdd = entitlement.get('poolQuantity') - entitlement.get('consumed');
        matchingSub.set('quantity_to_add', Math.min(matchingSub.get('quantity_to_add'), qtyAvailableToAdd));
        matchingSub.set('total_quantity', entitlement.get('poolQuantity'));
      });

      results.pools.forEach(pool => {
        let matchingSub = subscriptions.findBy('contract_number', pool.get('contractNumber'));
        if (Ember.isEmpty(matchingSub)) {
          matchingSub = this.createSubscription(pool, deployment);
          subscriptions.push(matchingSub);
        }

        let qtyAvailableToAdd = pool.get('quantity') - pool.get('consumed');
        matchingSub.set('quantity_to_add', Math.min(matchingSub.get('quantity_to_add'), qtyAvailableToAdd));
        matchingSub.set('total_quantity', pool.get('quantity'));
      });

      let promises = [];
      subscriptions.forEach(subscription => {
        let hasEntitlement = results.entitlements.findBy('contractNumber', subscription.get('contract_number'));
        let hasAvailablePool = results.pools.findBy('contractNumber', subscription.get('contract_number'));

        if (!hasAvailablePool) {
          subscription.set('quantity_to_add', 0);
        }

        if (hasEntitlement || hasAvailablePool) {
          promises.push(subscription.save());
        } else {
          promises.push(subscription.destroyRecord());
        }
      });

      return Ember.RSVP.hash({
        entitlements: results.entitlements,
        pools: results.pools,
        subscriptions: Ember.RSVP.all(promises)
      });
    });
  },

  createSubscription(subInfo, deployment) {
    return this.store.createRecord('subscription', {
      'contract_number': subInfo.get('contractNumber'),
      'product_name': subInfo.get('productName'),
      'quantity_to_add': 0,
      'quantity_attached': 0,
      'source': 'added',
      'start_date': subInfo.get('startDate'),
      'end_date': subInfo.get('endDate'),
      'deployment': deployment
    });
  }




});