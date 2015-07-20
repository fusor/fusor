import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ['application', 'deployment'],

  isUpstream: Ember.computed.alias("controllers.application.isUpstream"),
  stepNumberSubscriptions: Ember.computed.alias("controllers.deployment.stepNumberSubscriptions"),
  enableAccessInsights: Ember.computed.alias("controllers.deployment.model.enable_access_insights"),
  numSubscriptionsRequired: Ember.computed.alias("controllers.deployment.numSubscriptionsRequired"),

  hasSubscriptionsToAttach: function() {
    return (this.get('model.length') > 0);
  }.property('model.[]'),

  enableAnalytics: function() {
    if (this.get('enableAccessInsights')) { return 'Enabled'; } else { return 'Disabled'; }
  }.property('enableAccessInsights'),

  analyticsColor: function() {
    if (this.get('enableAnalytics')) { return ''; } else { return 'disabled-color'; }
  }.property('enableAccessInsights'),

});
