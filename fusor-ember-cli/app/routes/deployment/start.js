import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('satelliteTabRouteName', 'satellite.index');
  },

  activate() {
    this.controllerFor('deployment').set('isHideWizard', true);
  },

  deactivate() {
    this.controllerFor('deployment').set('isHideWizard', false);
    return this.send('saveDeployment', null);
  }

});
