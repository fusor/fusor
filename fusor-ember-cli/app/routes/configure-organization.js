import Ember from 'ember';

export default Ember.Route.extend({

  model: function () {
    return this.modelFor('deployment').get('organization');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    var organizations = this.store.find('organization');
    controller.set('organizations', organizations);
  },

  deactivate: function() {
    return this.send('saveDeployment', null);
  }

});
