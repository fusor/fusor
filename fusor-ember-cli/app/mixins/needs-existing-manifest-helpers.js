import Ember from 'ember';

export default Ember.Mixin.create({
  shouldUseExistingManifest() {
    const orgId = this.modelFor('deployment').get('organization.id');
    const modelUpstreamConsumerUuid = this.modelFor('deployment')
      .get('upstream_consumer_uuid');
    const hasModelUpstreamConsumerUuid = Ember.isPresent(modelUpstreamConsumerUuid);

    return new Ember.RSVP.Promise((res, rej) => {
      const url = `/katello/api/v2/organizations/${orgId}`;
      Ember.$.getJSON(url).then(results => {
        const satManifestExists =
          Ember.isPresent(results.owner_details) &&
          Ember.isPresent(results.owner_details.upstreamConsumer);

        if(!satManifestExists && hasModelUpstreamConsumerUuid) {
          // Edge case where an upstream_consumer_uuid has been saved into the
          // fusor model but not yet uploaded to satellite. Indicates a deployment
          // in progress, but not one where satellite already has an existing
          // manifest available for reuse
          res(false);
        } else if(satManifestExists && hasModelUpstreamConsumerUuid){
          if(results.owner_details.upstreamConsumer.uuid !== modelUpstreamConsumerUuid) {
            // ERROR: Manifest uuid reported by satellite differs from that on the model
            // something is corrupt. Assert failure.
            throw 'ERROR: upstreamConsumer.uuid does not match the one found on the' +
              'fusor deployment model!';
          } else {
            // Existing manifest was found in satellite and matches the one set on the
            // model by the deployment route, continue with streamlined subs
            res(true);
          }
        } else {
          // Standard new deployment with no manifest in Sat and with no manifest
          // having ever been uploaded via the Fusor wizard
          res(false);
        }
      }, () => rej(false));
    });
  },

  loadSubscriptions() {
    const orgId = this.modelFor('deployment').get('organization.id');
    const subsUrl = `/katello/api/v2/organizations/${orgId}/subscriptions`;
    return new Ember.RSVP.Promise((res, rej) => {
      Ember.$.getJSON(subsUrl).then(response => {
        if(Ember.isNone(response.results)) {
          res(Ember.A());
        } else {
          const subs = Ember.A(response.results)
            .filter(sub => sub.name !== 'Fusor')
            .map(sub => {
              return Ember.Object.create({
                product_name: sub.name,
                contract_number: sub.contract_number,
                start_date: sub.start_date,
                end_date: sub.end_date,
                quantity_attached: sub.quantity
              });
            });
          res(subs);
        }
      },
      err => {
        console.log(
          'ERROR: Something went wrong loading subscription info ' +
          'during existing manifest load!');
        rej(err);
      });
    });
  }
});
