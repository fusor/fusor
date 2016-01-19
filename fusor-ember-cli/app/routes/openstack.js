import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Route.extend({

  model() {
    return this.modelFor('deployment');
  },

  setupController(controller, model) {
    controller.set('model', model);
    var stepNumberOpenstack = this.controllerFor('deployment').get('stepNumberOpenstack');
    return this.controllerFor('deployment').set('currentStepNumber', stepNumberOpenstack);
  }
});
