import Ember from 'ember';

export default Ember.Component.extend({

  newNodeTitle: Ember.computed('isStep1', function() {
    if (this.get('isStep1')) {
      return "Register Nodes";
    } else {
      return "Node Auto-detection";
    }
  }),

  isNewNodeMethodAuto: Ember.computed('registerNodesMethod', function() {
    return this.get('registerNodesMethod') === 'auto_detect';
  }),

  isNewNodeMethodCSV: Ember.computed('registerNodesMethod', function() {
    return this.get('registerNodesMethod') === 'csv_upload';
  }),

  isNewNodeMethodManual: Ember.computed('registerNodesMethod', function() {
    return this.get('registerNodesMethod') === 'manual';
  }),

  actions: {
    nodeMethodChanged() {
      console.log(this.get('registerNodesMethod'));
    },
    cancelRegisterNodes() {
      this.set('openModal', false);
    },
    submitDetectNodes() {
      this.sendAction('submitDetectNodes');
    },
    submitRegisterNodes() {
      this.sendAction('submitRegisterNodes');
    },
    backStep() {
      this.sendAction('backStep');
    },
    csvFileChosen() {
      this.sendAction('csvFileChosen');
    },
    addMacAddress() {
      this.sendAction('addMacAddress');
    }
  }

});
