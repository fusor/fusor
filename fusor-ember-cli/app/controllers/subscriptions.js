import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['deployment', 'subscriptions/credentials', 'subscriptions/management-application'],

  stepNumberSubscriptions: Ember.computed.alias("controllers.deployment.stepNumberSubscriptions"),
  isStarted: Ember.computed.alias("controllers.deployment.isStarted"),

  disableTabManagementApplication: function() {
     return (!this.get('isStarted') && !this.get('model.isAuthenticated'));
  }.property('model.isAuthenticated', 'isStarted'),

  upstreamConsumerUuid: Ember.computed.alias("controllers.deployment.model.upstream_consumer_uuid"),

  disableTabSelectSubsciptions: function() {
    return (Ember.isBlank(this.get('upstreamConsumerUuid')) || !this.get('model.isAuthenticated'));
  }.property('model.isAuthenticated', 'upstreamConsumerUuid')

});
