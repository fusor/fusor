import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('satelliteTabRouteName', 'deployment-new.satellite.index');
    controller.set('model.deploy_rhev', true);
    controller.set('model.deploy_cfme', true);
  },

  activate: function() {
    this.controllerFor('deployment-new').set('isHideWizard', true);
  },

  deactivate: function() {
    this.controllerFor('deployment-new').set('isHideWizard', false);
  }

});
