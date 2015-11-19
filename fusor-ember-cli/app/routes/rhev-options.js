import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, model) {
    controller.set('model', model);
  },

  deactivate() {
    return this.send('saveDeployment', null);
  }
});
