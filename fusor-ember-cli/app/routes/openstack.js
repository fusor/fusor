import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller, model) {
    controller.set('model', model);
    var stepNumberOpenstack = this.controllerFor('deployment').get('stepNumberOpenstack');
    return this.controllerFor('deployment').set('currentStepNumber', stepNumberOpenstack);
  }

});
