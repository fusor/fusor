import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel: function() {
    return this.store.unloadAll('entitlement');
  },

  model: function(params) {
    var uuid = this.modelFor('deployment').get('upstream_consumer_uuid');
    console.log('uuid is ' + uuid);
    return this.store.query('entitlement', {uuid: uuid});
  },

  // setupController: function(controller, model) {
  //   controller.set('model', model);
  //   this.controllerFor('subscriptions/management-application').set('showEntitlements', true);
  // }

  activate: function() {
    this.controllerFor('subscriptions/management-application').set('showManagementApplications', false);
  },

  deactivate: function() {
    this.controllerFor('subscriptions/management-application').set('showManagementApplications', true);
  }

});
