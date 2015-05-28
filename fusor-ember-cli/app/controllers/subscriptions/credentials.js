import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment'],

  upstream_consumer_uuid: Ember.computed.alias("controllers.deployment.upstream_consumer_uuid"),
  upstream_consumer_name: Ember.computed.alias("controllers.deployment.upstream_consumer_name"),

  //overwritten by setupController
  organizationUpstreamConsumerUUID: null,
  organizationUpstreamConsumerName: null,

  disableCredentialsNext: function() {
    return !(Ember.isPresent(this.get('identification')) && Ember.isPresent(this.get('password')) || Ember.isPresent(this.get('model.isAuthenticated')));
  }.property('username', 'password', 'model.isAuthenticated'),

  hasUpstreamConsumerUuid: function() {
    return Ember.isPresent(this.get('upstream_consumer_uuid'));
  }.property('upstream_consumer_uuid'),

  hasOrganizationUpstreamConsumerUUID: function() {
    return Ember.isPresent(this.get('organizationUpstreamConsumerUUID'));
  }.property('organizationUpstreamConsumerUUID'),

});
