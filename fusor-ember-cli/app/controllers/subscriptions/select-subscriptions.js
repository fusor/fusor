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

  totalCountSubscriptions: Ember.computed.alias('model.length'),

  totalSelectedCount: function(){
      return this.get('model').filterBy('isSelectedSubscription', true).get('length');
  }.property('model.@each.isSelectedSubscription'),

  selectedSubscriptions: function(){
    return this.get('model').filterBy('isSelectedSubscription', true);
  }.property('model.@each.isSelectedSubscription'),

  hasSubscriptionsToAttach: function(){
    var model = this.get('model');
    return (model && model.isAny('isSelectedSubscription'));
  }.property('model.@each.isSelectedSubscription'),

  allQuantitiesValid: function() {
    var allValid = true;
    this.get('selectedSubscriptions').forEach(function(item) {
      if ((item.qtyAvailable > 0) && (item.qtyToAttach > 0) && allValid) {
        if (item.qtyToAttach > item.qtyAvailable) {
          allValid = false;
        }
      } else {
        allValid = false;
      }
    });
    return allValid;
  }.property('model.@each.qtyToAttach', 'model.@each.isSelectedSubscription'),

  showErrorMessage: Ember.computed.not('allQuantitiesValid'),
  disableNextOnSelectSubscriptions: Ember.computed.not('allQuantitiesValid'),

});
