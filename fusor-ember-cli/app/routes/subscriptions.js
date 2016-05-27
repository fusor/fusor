import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    const sessionPortal = this.store.findAll('session-portal').then(results => {
      if (Ember.isBlank(results)) {
        return this.store.createRecord('session-portal');
      } else {
        return results.get('firstObject');
      }
    });


    return this.shouldUseExistingManifest().then(useExistingManifest => {
      const modelHash = {sessionPortal, useExistingManifest};
      if(useExistingManifest) {
        modelHash.subscriptions = this.loadSubscriptions();
      }
      return Ember.RSVP.hash(modelHash);
    });
  },

  setupController(controller, model) {
    controller.set('model', model.sessionPortal);
    // Check if there's an existing manifest in satellite that should be used
    // If so, we want to streamline subscriptions and simply reuse that manifest
    // Steps A-C in a brand new deployment are no longer needed, so simply display
    // the review and continue.
    controller.set('useExistingManifest', model.useExistingManifest);
    if(model.useExistingManifest) {
      this.transitionTo('subscriptions.review-subscriptions');
    }

    var stepNumberSubscriptions = this.controllerFor('deployment').get('stepNumberSubscriptions');
    return this.controllerFor('deployment').set('currentStepNumber', stepNumberSubscriptions);
  },

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
  },

  actions: {
    error() {
      return true; // bubbles error event
    }
  }
});
