import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller, model) {
    controller.set('model', model);
    var stepNumberReview = this.controllerFor('deployment').get('stepNumberReview');
    return this.controllerFor('deployment').set('currentStepNumber', stepNumberReview);
  }

});
