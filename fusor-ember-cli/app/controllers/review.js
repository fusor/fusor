import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['subscriptions', 'application', 'deployment', 'review/progress/overview'],

  isUpstream: Ember.computed.alias("controllers.application.isUpstream"),
  disableNext: Ember.computed.alias("controllers.subscriptions.disableNext"),

  nameSelectSubscriptions: Ember.computed.alias("controllers.deployment.nameSelectSubscriptions"),

  stepNumberReview: Ember.computed.alias("controllers.deployment.stepNumberReview"),

  deployTaskIsFinished: Ember.computed.alias("controllers.review/progress/overview.deployTaskIsFinished"),

  disableTabInstallation: function() {
    return (this.get('disableNext') && (!(this.get('isUpstream'))));
  }.property('disableNext', 'isUpstream'),

  disableTabProgress: function() {
    return !(this.get('controllers.deployment.isStarted'));
  }.property('controllers.deployment.isStarted'),

  disableTabSummary: Ember.computed.not("deployTaskIsFinished")

});
