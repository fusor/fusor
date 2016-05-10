import Ember from 'ember';

export default Ember.Component.extend({

  addNodeTitle: Ember.computed('nodeInfo.address', function() {
    return "Add Node(s) to " + this.get('nodeInfo.address');
  }),

  actions: {
    addMacAddress() {
      this.sendAction('addMacAddress');
    },
    cancelAddNodes() {
      this.set('openModal', false);
    },
    submitAddNodes() {
      this.sendAction('submitAddNodes');
    }
  }

});
