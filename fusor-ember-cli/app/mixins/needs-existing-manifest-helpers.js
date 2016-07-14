import Ember from 'ember';

export default Ember.Mixin.create({
  shouldUseExistingManifest() {
    const orgId = this.modelFor('deployment').get('organization.id');
    const modelUpstreamConsumerUuid = this.modelFor('deployment')
      .get('upstream_consumer_uuid');
    const hasModelUpstreamConsumerUuid = Ember.isPresent(modelUpstreamConsumerUuid);

    return new Ember.RSVP.Promise((res, rej) => {
      const url = `/katello/api/v2/organizations/${orgId}/subscriptions`;
      Ember.$.getJSON(url).then(response => {

        const satManifestExists = response.results.filter(sub => {
          return sub.name !== 'Fusor';
        }).length > 0;

        res(satManifestExists);

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
