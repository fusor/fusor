import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.modelFor('deployment').get('organization');
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('showAlertMessage', false);
    var organizations = this.store.findAll('organization');
    controller.set('organizations', organizations);
  },

  deactivate() {
    return this.send('saveDeployment', null);
  }

});
