import Ember from 'ember';

export default Ember.Route.extend({
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
  model() {
    const useExistingManifest =
      this.modelFor('subscriptions').useExistingManifest;

    if(useExistingManifest) { // Case 3)
      return this.loadExistingManifest();
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

  setupController(controller, model) {
    controller.set('model', model);
    controller.set(
      'useExistingManifest',
      this.modelFor('subscriptions').useExistingManifest);
  },

  loadExistingManifest() {
    // TODO: DEBUG:
    return new Ember.RSVP.Promise((res, rej) => {
      const subs = Ember.A([]);

      subs.push(Ember.Object.create({
        product_name: 'MOCKED PRODUCT',
        contract_number: '10670000',
        start_date: '2015-03-31T04:00:00.000+0000',
        end_date: '2016-03-31T03:59:59.000+0000',
        quantity_attached: 10,
        total_quantity: 400
      }));

      res(subs);
    });
  }
});
