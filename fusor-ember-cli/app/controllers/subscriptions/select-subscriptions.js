import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ['application', 'deployment'],

  itemController: 'subscription',

  isUpstream: Ember.computed.alias("controllers.application.isUpstream"),
  stepNumberSubscriptions: Ember.computed.alias("controllers.deployment.stepNumberSubscriptions"),
  enable_access_insights: Ember.computed.alias("controllers.deployment.enable_access_insights"),
  numSubscriptionsRequired: Ember.computed.alias("controllers.deployment.numSubscriptionsRequired"),

  enableAnalytics: function() {
    if (this.get('enable_access_insights')) { return 'Enabled'; } else { return 'Disabled'; }
  }.property('enable_access_insights'),

  analyticsColor: function() {
    if (this.get('enableAnalytics')) { return ''; } else { return 'disabled-color'; }
  }.property('enableAnalytics'),

});
