import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.modelFor('deployment').get('organization');
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('showAlertMessage', false);
    controller.set('defaultOrg', model);
    controller.set('selectedOrganization', model);
  },

  deactivate() {
    return this.send('saveDeployment', null);
  }

});
