import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    var self = this;
    return this.store.find('session-portal').then(function(results) {
      if (Ember.isBlank(results)) {
        return self.store.createRecord('session-portal');
      } else {
        return results.get('firstObject');
      }
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    var stepNumberSubscriptions = this.controllerFor('deployment').get('stepNumberSubscriptions');
    return this.controllerFor('deployment').set('currentStepNumber', stepNumberSubscriptions);
  },

  actions: {
    error: function(reason) {
      console.log(reason);
      alert(reason.statusText);
    }
  }
});
