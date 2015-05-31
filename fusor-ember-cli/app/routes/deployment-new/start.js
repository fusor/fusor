import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('satelliteTabRouteName', 'deployment-new.satellite.index');
    controller.set('deploy_rhev', true);
  },

  activate: function() {
    this.controllerFor('deployment-new').set('isHideWizard', true);
  },

  deactivate: function() {
    this.controllerFor('deployment-new').set('isHideWizard', false);
  },

});
