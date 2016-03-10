import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('satelliteTabRouteName', 'deployment-new.satellite.index');
    controller.set('isDisabledOpenShift', true);
    controller.set('isDisabledCfme', true);
  },

  activate() {
    this.controllerFor('deployment-new').set('isHideWizard', true);
  },

  deactivate() {
    this.controllerFor('deployment-new').set('isHideWizard', false);
  }

});
