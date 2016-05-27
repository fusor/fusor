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

    return Ember.RSVP.hash({
      sessionPortal,
      useExistingManifest: this.shouldUseExistingManifest()
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
    const deplController = this.controllerFor('deployment');
    return Ember.isPresent(deplController.get('model.upstream_consumer_uuid'));
  },

  actions: {
    error() {
      return true; // bubbles error event
    }
  }
});
