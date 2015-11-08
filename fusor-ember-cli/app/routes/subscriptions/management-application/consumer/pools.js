import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    var uuid = this.modelFor('deployment').get('upstream_consumer_uuid');
    return this.store.query('pool', {uuid: uuid});
  },

  activate: function() {
    this.controllerFor('subscriptions/management-application').set('showManagementApplications', false);
  },

  deactivate: function() {
    this.controllerFor('subscriptions/management-application').set('showManagementApplications', true);
  }

});
