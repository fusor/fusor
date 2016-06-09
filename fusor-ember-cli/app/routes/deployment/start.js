import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('satelliteTabRouteName', 'satellite.index');
    if (model.get('deploy_rhev') || model.get('deploy_openstack')) {
      controller.set('isDisabledOpenShift', false);
      controller.set('isDisabledCfme', false);
    } else {
      controller.set('isDisabledOpenShift', true);
      controller.set('isDisabledCfme', true);
    }
  },

  activate() {
    this.controllerFor('deployment').set('isHideWizard', true);
  },

  deactivate() {
    this.controllerFor('deployment').set('isHideWizard', false);
    this.controllerFor('deployment').set('backRouteNameOnSatIndex', 'deployment.start');
    return this.send('saveDeployment', null);
  }

});
