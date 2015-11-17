import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, model) {
    controller.set('model', model);
    controller.set('confirmCfmeRootPassword', this.controllerFor('deployment').get('model.cfme_root_password'));
    controller.set('confirmCfmeAdminPassword', this.controllerFor('deployment').get('model.cfme_admin_password'));
  },

  deactivate() {
    return this.send('saveDeployment', null);
  }

});
