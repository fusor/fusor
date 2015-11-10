import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, model) {
    controller.set('model', model);
    controller.set('confirmRhevRootPassword', this.controllerFor('deployment').get('model.rhev_root_password'));
    controller.set('confirmRhevEngineAdminPassword', this.controllerFor('deployment').get('model.rhev_engine_admin_password'));
  },

  deactivate() {
    return this.send('saveDeployment', null);
  }
});
