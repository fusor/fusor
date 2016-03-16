import Ember from 'ember';

export default Ember.Component.extend({

  isAddNewNodeDisabled: false,
  autoNodes: [],
  manualNodes: [],

  safeLabel: Ember.computed('nodeManager.address', function() {
    let label = this.get('nodeManager.address');
    return label ? label.replace(/[^A-Z0-9]/ig, '') : '';
  }),

  isEditable: Ember.computed('nodeManager.nodes.[]', function() {
    return Ember.isEmpty(this.get('nodeManager.nodes'));
  }),

  isValidLogin: Ember.computed('nodeManager.driver', 'nodeManager.address', 'nodeManager.username', 'nodeManager.password', function() {
    return Ember.isPresent(this.get('nodeManager.driver')) &&
      Ember.isPresent(this.get('nodeManager.address')) &&
      Ember.isPresent(this.get('nodeManager.username')) &&
      Ember.isPresent(this.get('nodeManager.password'));
  }),

  isAutoDetectDisabled: Ember.computed.not('isValidLogin'),
  isNodeListDisabled: Ember.computed.not('isValidLogin'),

  nodeCount: Ember.computed('nodeManager.nodes.@each.properties', function() {
    return this.get('nodeManager.nodes').reduce((prev, node) => prev + (node.get('ready') ? 1 : 0), 0);
  }),

  nodesPendingRegistration: Ember.computed('autoNodes.[]', 'manualNodes.[]', function() {
    return this.get('autoNodes.length') > 0 || this.get('manualNodes.length') > 0;
  }),

  cpuRange: Ember.computed('nodeManager.nodes.@each.properties.cpus', function () {
    let minCPUs = null, maxCPUs = null;
    let nodes = this.get('nodeManager.nodes');

    if (nodes) {
      nodes.forEach((node) => {
        let nodeCPUs = parseInt(node.get('properties.cpus'), 10);
        if (nodeCPUs) {
          minCPUs = minCPUs ? Math.min(minCPUs, nodeCPUs) : nodeCPUs;
          maxCPUs = maxCPUs ? Math.max(maxCPUs, nodeCPUs) : nodeCPUs;
        }
      });
    }

    if (minCPUs === maxCPUs) {
      return Ember.isPresent(minCPUs) ? `${minCPUs}` : '??';
    }

    return `${minCPUs} - ${maxCPUs}`;
  }),

  memRange: Ember.computed('nodeManager.nodes.@each.properties.memory_mb', function () {
    let minMem = null, maxMem = null;
    let nodes = this.get('nodeManager.nodes');

    if (nodes) {
      nodes.forEach((node) => {
        let memoryMB = parseInt(node.get('properties.memory_mb'), 10);
        if (memoryMB) {
          memoryMB = Math.floor(memoryMB / 1024);
          minMem = minMem ? Math.min(minMem, memoryMB) : memoryMB;
          maxMem = maxMem ? Math.max(maxMem, memoryMB) : memoryMB;
        }
      });
    }

    if (minMem === maxMem) {
      return Ember.isPresent(minMem) ? `${minMem} GB` : '??';
    }

    return `${minMem} GB - ${maxMem} GB`;
  }),

  storageRange: Ember.computed('nodeManager.nodes.@each.properties.local_gb', function () {
    let minStorage = null, maxStorage = null;
    let nodes = this.get('nodeManager.nodes');

    if (nodes) {
      nodes.forEach((node) => {
        let localGB = parseInt(node.get('properties.local_gb'), 10);
        if (localGB) {
          minStorage = minStorage ? Math.min(minStorage, localGB) : localGB;
          maxStorage = maxStorage ? Math.max(maxStorage, localGB) : localGB;
        }
      });
    }

    if (minStorage === maxStorage) {
      return Ember.isPresent(minStorage) ? `${minStorage} GB` : '??';
    }


    return `${minStorage} GB - ${maxStorage} GB`;
  }),

  actions: {
    onAddNode() {
      this.sendAction('addNodes', this.get('nodeManager'));
    },

    deleteNode(node, nodeLabel) {
      this.sendAction('deleteNode', node, nodeLabel);
    }
  }

});
