import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Route.extend({
  setupController(controller, model) {
    controller.set('model', model);
  },

  deactivate() {
    return this.send('saveDeployment', null);
  }
});
