import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['application', 'deployment'],

  isUpstream: Ember.computed.alias("controllers.application.isUpstream"),
  stepNumberSubscriptions: Ember.computed.alias("controllers.deployment.stepNumberSubscriptions"),
  enableAccessInsights: Ember.computed.alias("controllers.deployment.model.enable_access_insights"),
  numSubscriptionsRequired: Ember.computed.alias("controllers.deployment.numSubscriptionsRequired"),

  enableAnalytics: function() {
    if (this.get('enableAccessInsights')) { return 'Enabled'; } else { return 'Disabled'; }
  }.property('enableAccessInsights'),

  analyticsColor: function() {
    if (this.get('enableAccessInsights')) { return ''; } else { return 'disabled'; }
  }.property('enableAccessInsights'),

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
  disableNextOnSelectSubscriptions: Ember.computed.not('allQuantitiesValid')

});
