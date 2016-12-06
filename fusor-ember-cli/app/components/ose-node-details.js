import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'div',
  classNames: ['col-xs-11 col-md-8 col-lg-5 ose-node-details'],

  isEditMode: false,

  showNodeRatio: Ember.computed('isEditMode', 'nodeRatioOptions', function() {
    return this.get('isEditMode') && Ember.isPresent(this.get('nodeRatioOptions'));
  }),

  customEditLabel: Ember.computed('isEditMode', function() {
    return this.get('isEditMode') ? 'Finish Editing' : 'Custom Edit';
  }),

  selectedNumLeftNodesId: Ember.computed('leftTypeNode', function() {
    let safeString = this.get('leftTypeNode').replace(/\s+/g, '');
    return `${safeString}Input`;
  }),

  selectedNumRightNodesId: Ember.computed('rightTypeNode', function() {
    let safeString = this.get('rightTypeNode').replace(/\s+/g, '');
    return `${safeString}Input`;
  }),

  // When options are changed, it resets the selectedNodeRatio and then modifies the numLeftNodes
  // unintentionally.  This observer prevents the input selection from getting out of sync from the value.
  nodeRatioOptionsChanged: Ember.observer('numLeftNodes', 'nodeRatioOptions', function () {
    Ember.run.once(this, () => {
      if (this.get('selectedNodeRatio') !== this.get('numLeftNodes')) {
        this.set('selectedNodeRatio', this.get('numLeftNodes'));
      }
    });
  }),

  actions: {
    editOseNodeDetails() {
      this.saveOriginalData();
      this.set('isEditMode', true);
    },

    saveOseNodeDetails() {
      this.set('isEditMode', false);
    },

    cancelOseNodeDetails() {
      this.rollbackChanges();
      this.set('isEditMode', false);
    },

    nodeRatioChanged(numMasterNodes) {
      this.sendAction('nodeRatioChanged', numMasterNodes);
    }
  },

  saveOriginalData() {
    this.set('originalData', {
      numLeftNodes: this.get('numLeftNodes'),
      leftVcpu: this.get('leftVcpu'),
      leftRam: this.get('leftRam'),
      leftDisk: this.get('leftDisk'),
      leftTypeNode: this.get('leftTypeNode'),
      leftStorageSize: this.get('leftStorageSize'),
      numRightNodes: this.get('numRightNodes'),
      rightVcpu: this.get('rightVcpu'),
      rightRam: this.get('rightRam'),
      rightDisk: this.get('rightDisk'),
      rightTypeNode: this.get('rightTypeNode'),
      rightStorageSize: this.get('rightStorageSize')
    });
  },

  rollbackChanges() {
    this.set('numLeftNodes', this.get('originalData').numLeftNodes);
    this.set('leftVcpu', this.get('originalData').leftVcpu);
    this.set('leftRam', this.get('originalData').leftRam);
    this.set('leftDisk', this.get('originalData').leftDisk);
    this.set('leftTypeNode', this.get('originalData').leftTypeNode);
    this.set('leftStorageSize', this.get('originalData').leftStorageSize);
    this.set('numRightNodes', this.get('originalData').numRightNodes);
    this.set('rightVcpu', this.get('originalData').rightVcpu);
    this.set('rightRam', this.get('originalData').rightRam);
    this.set('rightDisk', this.get('originalData').rightDisk);
    this.set('rightTypeNode', this.get('originalData').rightTypeNode);
    this.set('rightStorageSize', this.get('originalData').rightStorageSize);
  }
});
