import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'tr',

  classNameBindings: ['bgColor'],

  systemType: Ember.computed('subscription.type', function() {
    if (this.get('subscription.type') === "NORMAL") {
      return 'Physical';
    } else {
      return this.get('subscription.type');
    }
  }),


  bgColor: Ember.computed('isChecked', function () {
    if (this.get('isChecked')) {
      return 'white-on-blue';
    }
  }),

  envCssId: Ember.computed('env', function () {
    return ('env_' + this.get('env.id'));
  }),

  isQtyValid: Ember.computed('subscription.qtyAvailable', 'subscription.qtyToAttach', function() {
    if ((this.get('subscription.qtyToAttach') > 0) && (this.get('subscription.qtyAvailable') > 0)) {
      return (this.get('subscription.qtyToAttach') <= this.get('subscription.qtyAvailable'));
    }
  }),
  isQtyInValid: Ember.computed.not('isQtyValid'),

  disableQty: Ember.computed('subscription.qtyAvailable', function() {
    return (this.get('subscription.qtyAvailable') === 0);
  }),

  setDefaultQtyToAttach: Ember.on('didInsertElement', function() {
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
  }),

  setIsSelectedSubscription: Ember.on('didInsertElement', function() {
    var contractsNumbers = (this.get('model').getEach('contract_number'));
    console.log('contractsNumbers are:');
    console.log(contractsNumbers);
    var yesno = contractsNumbers.contains(this.get('subscription.contractNumber'));
    this.get('subscription').set('isSelectedSubscription', yesno);
  }),

  isChecked: Ember.computed.alias('subscription.isSelectedSubscription'),

  actions: {
    setValidQty: function() {
      if (this.get('isQtyInValid')) {
          return this.set('subscription.qtyToAttach', this.get('subscription.qtyAvailable') );
      }
    }
  }

});
