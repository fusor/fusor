import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  subscriptionsController: Ember.inject.controller('subscriptions'),
  overviewController: Ember.inject.controller('review/progress/overview'),

  isUpstream: Ember.computed.alias("applicationController.isUpstream"),
  disableNext: Ember.computed.alias("subscriptionsController.disableNext"),

  nameSelectSubscriptions: Ember.computed.alias("deploymentController.nameSelectSubscriptions"),

  stepNumberReview: Ember.computed.alias("deploymentController.stepNumberReview"),

  deployTaskIsFinished: Ember.computed.alias("overviewController.deployTaskIsFinished"),

  disableTabInstallation: function() {
    return (this.get('disableNext') && (!(this.get('isUpstream'))));
  }.property('disableNext', 'isUpstream'),

  disableTabProgress: Ember.computed.not("isStarted"),

  disableTabSummary: Ember.computed.not("deployTaskIsFinished")

});
