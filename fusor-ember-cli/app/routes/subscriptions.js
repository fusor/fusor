import Ember from 'ember';
import NeedsExistingManifestHelpers from '../mixins/needs-existing-manifest-helpers';

export default Ember.Route.extend(NeedsExistingManifestHelpers, {

  model() {
    return this.shouldUseExistingManifest()
      .then(useExistingManifest => {
        const modelHash = {useExistingManifest};

        modelHash.sessionPortal = this.store.findAll('session-portal').then(results => {
          if (Ember.isBlank(results)) {
            return this.store.createRecord('session-portal');
          } else {
            return results.get('firstObject');
          }
        });

        if(useExistingManifest){
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

  actions: {
    error() {
      return true; // bubbles error event
    }
  }
});
