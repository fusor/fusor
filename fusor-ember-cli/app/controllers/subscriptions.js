import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['deployment', 'subscriptions/credentials', 'subscriptions/management-application'],

  stepNumberSubscriptions: Ember.computed.alias("controllers.deployment.stepNumberSubscriptions"),
  isStarted: Ember.computed.alias("controllers.deployment.isStarted"),

  disableTabManagementApplication: function() {
     return (!this.get('isStarted') && !this.get('model.isAuthenticated'));
  }.property('model.isAuthenticated', 'isStarted'),

  disableTabSelectSubsciptions: Ember.computed.alias("controllers.subscriptions/management-application.disableNextOnManagementApp"),

  uuid: Ember.computed.alias("controllers.deployment.upstream_consumer_uuid"),

});
