import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    // GET /fusor/subscriptions?source=imported&deployment_id=ID_OF_DEPLOYMENT
    var self = this;
    var deploymentId = this.modelFor('deployment').get('id');
    if (this.modelFor('deployment').get('is_disconnected')) {
      return this.store.query('subscription', {deployment_id: deploymentId, source: 'imported'});
    } else {
        // if there are no added subscriptions we need to show what is in the manifest instead.
      return this.store.query('subscription', {
        deployment_id: deploymentId,
        source: 'added'
      }).then(function(results) {

        let noSubsFound = results.get('length') === 0;

        if(noSubsFound) {

          let deployment = self.modelFor('deployment');
          let consumerUUID = self.modelFor('deployment').get('upstream_consumer_uuid');

          return self.store.query('entitlement', {uuid: consumerUUID}).then((entitlements) => {

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
  }

});
