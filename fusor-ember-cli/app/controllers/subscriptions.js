import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  needs: ['subscriptions/credentials', 'subscriptions/management-application'],

  stepNumberSubscriptions: Ember.computed.alias("controllers.deployment.stepNumberSubscriptions"),
  isStarted: Ember.computed.alias("controllers.deployment.isStarted"),
  isDisconnected: Ember.computed.alias("controllers.deployment.model.is_disconnected"),

  disableTabManagementApplication: function() {
     return (!this.get('isStarted') && !this.get('model.isAuthenticated'));
  }.property('model.isAuthenticated', 'isStarted'),

  disableTabReviewSubsciptions: Ember.computed.empty("controllers.deployment.model.manifest_file"),

  upstreamConsumerUuid: Ember.computed.alias("controllers.deployment.model.upstream_consumer_uuid"),

  disableTabSelectSubsciptions: function() {
    return (Ember.isBlank(this.get('upstreamConsumerUuid')) || !this.get('model.isAuthenticated'));
  }.property('model.isAuthenticated', 'upstreamConsumerUuid')

});
