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

  subCssId: Ember.computed('subscription', function () {
    return ('sub_checkbox_' + this.get('subscription.id'));
  }),

  attachCssId: Ember.computed('subscription', function () {
    return ('qty_attach_' + this.get('subscription.id'));
  }),

  isQtyValid: Ember.computed('subscription.qtyAvailable', 'subscription.qtyToAttach', function() {
    let qtyAvailable = this.get('subscription.qtyAvailable');
    let qtyToAttach = this.get('subscription.qtyToAttach');
    return Ember.isPresent(qtyToAttach) && qtyToAttach >= 0 && qtyToAttach <= qtyAvailable;
  }),

  qtyToAttachClass: Ember.computed('isQtyValid', function() {
    if (this.get('isQtyValid')) {
      return 'center';
    } else {
      return 'center invalid-input';
    }
  }),

  disableQty: Ember.computed('subscription.qtyAvailable', function() {
    return (this.get('subscription.qtyAvailable') === 0);
  }),

  setIsSelectedSubscription: Ember.on('didInsertElement', function() {
    // model is subscriptions added
    // this.get('subscription') is actually a pool
    var self = this;
    this.get('model').forEach(function(sub) {
      // update for matching subscription only
      if (sub.get('contract_number') == self.get('subscription.contractNumber')) {
        var hasQtyToAdd = sub.get('quantity_to_add') > 0;
        self.get('subscription').set('isSelectedSubscription', hasQtyToAdd);
        self.get('subscription').set('qtyToAttach', sub.get('quantity_to_add'));
      }
    });
  }),

  saveSubAfterCheck: Ember.observer('subscription.isSelectedSubscription', function() {
    if (this.get('subscription.isSelectedSubscription')) {
      if (this.get('subscription.qtyToAttach') > 0) {
            // nothing - don't want to change subscription.qtyToAttach
      } else {
        this.set('subscription.qtyToAttach', 0);
      }
    } else {
      // Zero out and save if unchecked
      var hasPostiveQty = this.get('subscription.qtyToAttach') > 0;
      if (hasPostiveQty) {
        this.set('subscription.qtyToAttach', 0);
        var pool = this.get('subscription');
        this.sendAction('saveSubscription', pool, this.get('subscription.qtyToAttach'));
      }
    }
  }),

  isChecked: Ember.computed.alias('subscription.isSelectedSubscription'),

  actions: {
    setValidQty() {
      if (!this.get('isQtyValid')) {
        this.set('subscription.qtyToAttach', 0 );
      }
      var pool = this.get('subscription');
      this.sendAction('saveSubscription', pool, this.get('subscription.qtyToAttach'));
    }
  }

});
