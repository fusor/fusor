import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller, model) {
    controller.set('model', model);
    return this.controllerFor('deployment').set('currentStepNumber', 1);
  },

  deactivate() {
    var deployment = this.modelFor('deployment');
    deployment.save().then(function() {
      return console.log('saved deployment successfully');
    });
  }

});
