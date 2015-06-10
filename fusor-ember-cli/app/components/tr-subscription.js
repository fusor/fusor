import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'tr',

  classNameBindings: ['bgColor'],

  systemType: function() {
    if (this.get('subscription.type') === "NORMAL") {
      return 'Physical';
    } else {
      return this.get('subscription.type');
    }
  }.property('subscription.type'),

  isChecked: function () {
    return this.get('subscription.isSelectedSubscription');
  }.property('subscription.isSelectedSubscription'),

  bgColor: function () {
    if (this.get('isChecked')) {
      return 'white-on-blue';
    }
  }.property('isChecked'),

  envCssId: function () {
    return ('env_' + this.get('env.id'));
  }.property('env'),

  isQtyValid: function() {
    if ((this.get('subscription.qtyToAttach') > 0) && (this.get('subscription.qtyAvailable') > 0)) {
      return (this.get('subscription.qtyToAttach') <= this.get('subscription.qtyAvailable'));
    }
  }.property('subscription.qtyAvailable', 'subscription.qtyToAttach'),
  isQtyInValid: Ember.computed.not('isQtyValid'),

  disableQty: function() {
    return (this.get('subscription.qtyAvailable') === 0);
  }.property('subscription.qtyAvailable'),

  setDefaultQtyToAttach: function() {
    this.get('subscription').set('qtyToAttach', this.get("numSubscriptionsRequired"));
    if (this.get('isQtyInValid')) {
      this.get('subscription').set('qtyToAttach', this.get("subscription.qtyAvailable"));
    }
  }.on('didInsertElement'),

});
