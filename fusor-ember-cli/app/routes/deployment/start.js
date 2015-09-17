import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('satelliteTabRouteName', 'satellite.index');
  },

  activate: function() {
    this.controllerFor('deployment').set('isHideWizard', true);
  },

  deactivate: function() {
    this.controllerFor('deployment').set('isHideWizard', false);
    return this.send('saveDeployment', null);
  }

});
