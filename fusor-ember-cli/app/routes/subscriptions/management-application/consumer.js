import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.findRecord('management-application', params.management_application_uuid);
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    var sessionPortal = this.modelFor('subscriptions');
    sessionPortal.set('consumerUUID', model.get('id'));
    sessionPortal.save();
    return this.controllerFor('deployment').set('upstream_consumer_uuid', model.get('id'));
  }

});
