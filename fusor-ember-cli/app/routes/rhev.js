import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller, model) {
    controller.set('model', model);
    return this.controllerFor('deployment').set('currentStepNumber', 2);
  },

});
