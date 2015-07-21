import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
        deployment: this.modelFor('deployment'),
        openstackPlan: this.store.find('deployment-plan', 'overcloud'),
        openstackNodes: this.store.find('node'),
        openstackProfiles: this.store.find('flavor')
    });
  },

  setupController: function(controller, model) {
    controller.set('model', model);
  }

});
