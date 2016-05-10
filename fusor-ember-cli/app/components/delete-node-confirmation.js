import Ember from 'ember';

export default Ember.Component.extend({

  deleteNodeTitle: Ember.computed('nodeToDeleteLabel', function() {
    return 'Delete Node ' + this.get('nodeToDeleteLabel');
  }),

  actions: {
    addMacAddress() {
      this.sendAction('addMacAddress');
    },
    cancelDeleteNode() {
      this.set('openModal', false);
    },
    confirmDeleteNode() {
      this.sendAction('confirmDeleteNode');
    }
  }

});
