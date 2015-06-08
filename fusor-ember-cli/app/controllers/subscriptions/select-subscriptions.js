import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ['application', 'deployment'],

  itemController: 'subscription',

  isUpstream: Ember.computed.alias("controllers.application.isUpstream"),
  stepNumberSubscriptions: Ember.computed.alias("controllers.deployment.stepNumberSubscriptions"),
  enable_access_insights: Ember.computed.alias("controllers.deployment.enable_access_insights"),

  enableAnalytics: function() {
    if (this.get('enable_access_insights')) { return 'Enabled'; } else { return 'Disabled'; }
  }.property('enable_access_insights'),

  buttonAttachTitle: function() {
    if (this.get('attachingInProgress')) {
      return "Attaching ...";
    } else {
      return "Attach Selected";
    }
  }.property('attachingInProgress'),

  analyticsColor: function() {
    if (this.get('enableAnalytics')) { return ''; } else { return 'disabled-color'; }
  }.property('enableAnalytics'),

  totalCountSubscriptions: Ember.computed.alias('model.length'),

  attachingInProgress: false,
  showAttachedSuccessMessage: false,

  disableSubscriptionsNext: function() {
    return (this.get('model.length') === 0) || this.get('attachingInProgress');
  }.property('model', 'attachingInProgress'),

  totalSelectedCount: function(){
      return this.get('model').filterBy('isSelectedSubscription', true).get('length');
  }.property('model.@each.isSelectedSubscription'),

  selectedSubscriptions: function(){
    return this.get('model').filterBy('isSelectedSubscription', true);
  }.property('model.@each.isSelectedSubscription'),

  disableAttachButton: function() {
    return !(this.get('model').isAny('isSelectedSubscription')) || this.get('attachingInProgress');
  }.property('model.@each.isSelectedSubscription', 'attachingInProgress'),

});
