import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('satelliteTabRouteName', 'deployment-new.satellite.index');
  },

  activate: function() {
    this.controllerFor('deployment-new').set('isHideWizard', true);
    this.controllerFor('deployment-new').set('deploy_rhev', true);
    this.controllerFor('deployment-new').set('deploy_openstack', false);
    this.controllerFor('deployment-new').set('deploy_cfme', false);
  },

  deactivate: function() {
    this.controllerFor('deployment-new').set('isHideWizard', false);
  },

});
