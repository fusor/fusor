import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['subscriptions', 'rhci', 'application', 'deployment'],

  isUpstream: Ember.computed.alias("controllers.application.isUpstream"),
  disableNext: Ember.computed.alias("controllers.subscriptions.disableNext"),

  disableTabProgress: function() {
    return !(this.get('controllers.deployment.isStarted'))
  }.property('controllers.deployment.isStarted'),

  disableTabInstallation: function() {
    return (this.get('disableNext') && (!(this.get('isUpstream'))));
  }.property('disableNext', 'isUpstream'),

  nameSelectSubscriptions: Ember.computed.alias("controllers.rhci.nameSelectSubscriptions"),

  stepNumberReview: Ember.computed.alias("controllers.deployment.stepNumberReview"),

});
