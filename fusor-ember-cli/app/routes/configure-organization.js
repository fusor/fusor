import Ember from 'ember';

export default Ember.Route.extend({

  model: function () {
    return this.modelFor('deployment').get('organization');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('showAlertMessage', false);
    var organizations = this.store.findAll('organization');
    controller.set('organizations', organizations);
  },

  deactivate: function() {
    return this.send('saveDeployment', null);
  }

});
