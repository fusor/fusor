import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, model) {
    controller.set('model', model);
    // Reset error msg if this has been displayed previously
    controller.set('errorMsg', null);
  },
  deactivate() {
    return this.send('saveDeployment', null);
  }
});
