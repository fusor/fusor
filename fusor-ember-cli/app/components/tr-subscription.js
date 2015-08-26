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
    var contractNumber = this.get("subscription.contractNumber");
    var matchingSubscription   = this.get('model').filterBy('contract_number', contractNumber).get('firstObject');
    if (Ember.isPresent(matchingSubscription) && matchingSubscription.get('quantity_attached') > 0) {
        this.get('subscription').set('qtyToAttach', matchingSubscription.get('quantity_attached'));
    } else {
      this.get('subscription').set('qtyToAttach', this.get("numSubscriptionsRequired"));
      if (this.get('isQtyInValid')) {
        this.get('subscription').set('qtyToAttach', this.get("subscription.qtyAvailable"));
      }
    }
  }.on('didInsertElement'),

  setIsSelectedSubscription: function() {
    var contractsNumbers = (this.get('model').getEach('contract_number'));
    console.log('contractsNumbers are:');
    console.log(contractsNumbers);
    var yesno = contractsNumbers.contains(this.get('subscription.contractNumber'));
    this.get('subscription').set('isSelectedSubscription', yesno);
  }.on('didInsertElement'),

  isChecked: Ember.computed.alias('subscription.isSelectedSubscription'),

  actions: {
    setValidQty: function() {
      if (this.get('isQtyInValid')) {
          return this.set('subscription.qtyToAttach', this.get('subscription.qtyAvailable') );
      }
    }
  }

});
