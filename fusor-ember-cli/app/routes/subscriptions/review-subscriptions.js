import Ember from 'ember';
import SubscriptionUtil from '../../utils/subscription-util';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      subscriptions: this.loadSubscriptions(),
      sufficientEntitlements: this.loadSubscriptionsValidation()
    });
  },

  setupController(controller, model) {
    controller.set('model', model.subscriptions);
    controller.set(
      'useExistingManifest',
      this.modelFor('subscriptions').useExistingManifest);
    controller.set('sufficientEntitlements', model.sufficientEntitlements);
  },

  loadSubscriptions() {
    ////////////////////////////////////////////////////////////
    // NOTE: Review data can comes from three different sources depending on scenario
    // 1) Connected -> No existing manifest, uploading manifest as part of the deployment
    //    by logging into the CDN as part of the deployment. Review info comes from
    //    customer portal.
    // 2) Disconnected -> No existing manifest, uploading manifest locally. Entitlement
    //    data was previously stored in fusor_subscriptions table as part of that upload.
    //    We ask fusor server for that data via subscription endpoint
    // 3) useExistingManifest -> Manifest was *not* uploaded as part of current deployment,
    //    instead we're using an existing manifest that's been uploaded to Sat previously.
    //    In this case, might not be logged in, and fusor_subscriptions table probably does
    //    not have the data we need, so neither 1) or 2) approaches can be used. Need to
    //    hit Sat to retrieve what it knows about the existing manifest.
    ////////////////////////////////////////////////////////////
    const subModel = this.modelFor('subscriptions');
    const useExistingManifest = subModel.useExistingManifest;

    if(useExistingManifest) { // Case 3)
      // Note: subscriptions will only be available if useExistingManifest is true
      return subModel.subscriptions;
    }

    const deploymentId = this.modelFor('deployment').get('id');
    if (this.modelFor('deployment').get('is_disconnected')) { // Case 2)
      // GET /fusor/subscriptions?source=imported&deployment_id=ID_OF_DEPLOYMENT
      return this.store.query('subscription', {deployment_id: deploymentId, source: 'imported'});
    } else { // Case 1)
        // if there are no added subscriptions we need to show what is in the manifest instead.
      return this.store.query('subscription', {
        deployment_id: deploymentId,
        source: 'added'
      }).then(results => {
        const noSubsFound = results.get('length') === 0;

        if(noSubsFound) {

          const deployment = this.modelFor('deployment');
          const consumerUUID = this.modelFor('deployment').get('upstream_consumer_uuid');

          return this.store.query('entitlement', {uuid: consumerUUID}).then((entitlements) => {

            let pseudoSubs = entitlements.map((pool) => {
              return Ember.Object.create({
                contract_number: pool.get('contractNumber'),
                product_name: pool.get('productName'),
                quantity_to_add: 0,
                quantity_attached: pool.get('qtyAttached'),
                source: 'added',
                start_date: pool.get('startDate'),
                end_date: pool.get('endDate'),
                total_quantity: pool.get('quantity'),
                deployment: deployment
              });
            });

            return pseudoSubs;
          });
        } else {
          return results.filter(function(sub) {
            return sub.get('qtySumAttached') > 0;
          });
        }
      });
    }
  },

  loadSubscriptionsValidation() {
    const deploymentId = this.modelFor('deployment').get('id');
    return SubscriptionUtil.validate(deploymentId);
  }
});
