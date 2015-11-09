import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller, model) {
    controller.set('model', model);
    var stepNumberCloudForms = this.controllerFor('deployment').get('stepNumberCloudForms');
    return this.controllerFor('deployment').set('currentStepNumber', stepNumberCloudForms);
  }

});
