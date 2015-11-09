import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller, model) {
    controller.set('model', model);
    return this.controllerFor('deployment').set('currentStepNumber', 2);
  }

});
