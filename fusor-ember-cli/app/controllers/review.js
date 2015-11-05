import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  needs: ['subscriptions', 'application', 'review/progress/overview'],

  isUpstream: Ember.computed.alias("controllers.application.isUpstream"),
  disableNext: Ember.computed.alias("controllers.subscriptions.disableNext"),

  nameSelectSubscriptions: Ember.computed.alias("controllers.deployment.nameSelectSubscriptions"),

  stepNumberReview: Ember.computed.alias("controllers.deployment.stepNumberReview"),

  deployTaskIsFinished: Ember.computed.alias("controllers.review/progress/overview.deployTaskIsFinished"),

  disableTabInstallation: function() {
    return (this.get('disableNext') && (!(this.get('isUpstream'))));
  }.property('disableNext', 'isUpstream'),

  disableTabProgress: Ember.computed.not("isStarted"),

  disableTabSummary: Ember.computed.not("deployTaskIsFinished")

});
