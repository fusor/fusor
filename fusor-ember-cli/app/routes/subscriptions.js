import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    var self = this;
    return this.store.findAll('session-portal').then(function(results) {
      if (Ember.isBlank(results)) {
        return self.store.createRecord('session-portal');
      } else {
        return results.get('firstObject');
      }
    });
  },

  setupController(controller, model) {
    controller.set('model', model);
    var stepNumberSubscriptions = this.controllerFor('deployment').get('stepNumberSubscriptions');
    return this.controllerFor('deployment').set('currentStepNumber', stepNumberSubscriptions);
  },

  actions: {
    error(reason, transition) {
      // bubble up this error event:
      return true;
    }
  }
});
