import Ember from 'ember';
import OspNodeForm from '../mixins/osp-node-form-mixin';

export default Ember.Component.extend(OspNodeForm, {

  registerNodesMethod: 'manual',

  addNodeTitle: Ember.computed('nodeInfo.address', function() {
    return "Add Node(s) to " + this.get('nodeInfo.address');
  }),

  nodeDriverHumanized: Ember.computed('nodeInfo.driver', function () {
    let driver = this.get('drivers').findBy('value', this.get('nodeInfo.driver'));
    if (driver) {
      return driver.label;
    }
  }),

  disableNewNodesSubmit: Ember.computed.not('isValidNewNodeManual'),

  actions: {
    addMacAddress() {
      this.get('nodeInfo.macAddresses').pushObject(Ember.Object.create({value: ''}));
    },
    cancelAddNodes() {
      this.set('openModal', false);
    },
    submitAddNodes() {
      this.sendAction('submitAddNodes', this.get('nodeInfo'));
      this.set('openModal', false);
    }
  }
});
