import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  stepNumberSubscriptions: Ember.computed.alias("deploymentController.stepNumberSubscriptions"),
  isStarted: Ember.computed.alias("deploymentController.isStarted"),
  isDisconnected: Ember.computed.alias("deploymentController.model.is_disconnected"),

  disableTabManagementApplication: Ember.computed('model.isAuthenticated', 'isStarted', function() {
    return (!this.get('isStarted') && !this.get('model.isAuthenticated'));
  }),

  disableTabReviewSubsciptions: Ember.computed.empty("deploymentController.model.manifest_file"),

  upstreamConsumerUuid: Ember.computed.alias("deploymentController.model.upstream_consumer_uuid"),

  disableTabSelectSubsciptions: Ember.computed('model.isAuthenticated', 'upstreamConsumerUuid', function() {
    return (Ember.isBlank(this.get('upstreamConsumerUuid')) || !this.get('model.isAuthenticated'));
  })

});
