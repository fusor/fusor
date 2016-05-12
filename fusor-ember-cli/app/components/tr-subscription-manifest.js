import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',

  qtyColumn: Ember.computed(
    'isDisconnected',
    'subscription.quantity_to_add',
    'subscription.quantity_attached',
    'subscription.qtySumAttached',
    function() {
      if (this.get('isDisconnected')) {
        return this.get('subscription.quantity_attached');

      } else if (this.get('subscription.quantity_to_add') > 0) {
        return this.get('subscription.quantity_attached') + ' + ' +
          this.get('subscription.quantity_to_add') + ' = ' +
          this.get('subscription.qtySumAttached');
      } else {
        return this.get('subscription.quantity_attached');
      }
    }
  )
});
