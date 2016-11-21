import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import OpenshiftMixin from "../../mixins/openshift-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, OpenshiftMixin, {

  nodeRatioOptions: [],
  openshiftController: Ember.inject.controller('openshift'),

  // similar code to CFME where-install.js. Possible to DRY into mixin
  isRhev: Ember.computed.alias("deploymentController.isRhev"),
  isNotRhev: Ember.computed.not("isRhev"),
  isOpenStack: Ember.computed.alias("deploymentController.isOpenStack"),
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),
  isNotOpenStack: Ember.computed.not("isOpenStack"),

  isOverCapacity: Ember.computed.alias("openshiftController.isOverCapacity"),
  isInvalidOpenshiftNodes: Ember.computed.alias("openshiftController.isInvalidOpenshiftNodes"),

  disableRHEV: Ember.computed('isStarted', 'isNotRhev', function() {
    return (this.get('isStarted') || this.get('isNotRhev'));
  }),

  disableOpenStack: Ember.computed('isStarted', 'isNotOpenStack', function() {
    return (this.get('isStarted') || this.get('isNotOpenStack'));
  }),

  disableRHEVradio: Ember.computed('disableRHEV', 'isStarted', function () {
    return (this.get('disableRHEV') || this.get('isStarted'));
  }),

  disableOpenstackradio: Ember.computed('disableOpenStack', 'isStarted', function () {
    return (this.get('disableOpenStack') || this.get('isStarted'));
  }),

  haSelected: Ember.computed('oseDeploymentType', function() {
    return this.get('oseDeploymentType') === 'highly_available';
  }),

  backRouteName: Ember.computed('isOpenStack', 'isRhev', function() {
    if (this.get('isOpenStack')) {
      return 'openstack.overcloud';
    } else if (this.get('isRhev')) {
      return 'storage';
    } else {
      return 'satellite.access-insights';
    }
  }),

  onOseDeploymentTypeEdited: Ember.observer('oseDeploymentType', function () {
    Ember.run.once(this, () => {
      this.calculateNodeRatioOptions();
      this.calculateAutoNodeRatio();
    });
  }),

  onNumTotalNodesEdited: Ember.observer('numTotalNodes', function () {
    Ember.run.once(this, () => {
      let numTotalNodes = this.get('numTotalNodes');
      let nonNumberInput = numTotalNodes % 1 !== 0;
      let invalidHaNodeValues = this.get('oseDeploymentType') === 'highly_available' && numTotalNodes < 8;
      let invalidSingleNodeValues = numTotalNodes < 2;
      if (nonNumberInput || invalidHaNodeValues || invalidSingleNodeValues) {
        this.invalidateNodeInput();
      } else {
        this.calculateNodeRatioOptions();
        this.calculateAutoNodeRatio();
      }
    });
  }),

  invalidateNodeInput() {
    this.set('nodeRatioOptions', []);
    this.set('numMasterNodes', null);
    this.set('numWorkerNodes', null);
  },

  calculateAutoNodeRatio() {
    let oseDeploymentType = this.get('oseDeploymentType');
    let numTotalNodes = this.get('numTotalNodes');
    numTotalNodes = Ember.isPresent(numTotalNodes) ? numTotalNodes : 0;

    let numMasterNodes = this.get('numMasterNodes');
    let numWorkerNodes = this.get('numWorkerNodes');

    if (this.get('oseDeploymentType') === 'single_node') {
      numTotalNodes = Math.max(numTotalNodes, 2);
      numMasterNodes = 1;
      numWorkerNodes = numTotalNodes - numMasterNodes;
    } else if (this.get('oseDeploymentType') === 'highly_available') {
      numTotalNodes = Math.max(numTotalNodes, 8);
      let numConfigurableNodes = numTotalNodes - this.get('numHaLoadBalancers') - this.get('numHaInfraNodes');
      let maxMasterNodes = Math.floor(numConfigurableNodes / 2) * 2 -1;
      numMasterNodes = Math.min(numMasterNodes, maxMasterNodes);
      numMasterNodes = Math.max(numMasterNodes, 3);
      numWorkerNodes = numConfigurableNodes - numMasterNodes;
    }

    if (this.get('numTotalNodes') !== numTotalNodes) {
      this.set('numTotalNodes', numTotalNodes);
    }

    if (this.get('numMasterNodes') !== numMasterNodes) {
      this.set('numMasterNodes', numMasterNodes);
    }

    if (this.get('numWorkerNodes') !== numWorkerNodes) {
      this.set('numWorkerNodes', numWorkerNodes);
    }
  },

  calculateNodeRatioOptions() {
    let options = [];
    let numTotalNodes = this.get('numTotalNodes');

    if (this.get('oseDeploymentType') === 'highly_available' && numTotalNodes) {
      let configurableNodes = numTotalNodes - this.get('numHaLoadBalancers') - this.get('numHaInfraNodes');
      let minMasterNodes = 3;
      let maxMasterNodes = configurableNodes - 1;  //1 workers minimum
      for (let numMasters = minMasterNodes; numMasters <= maxMasterNodes; numMasters += 2) {
        let numWorkerNodes = configurableNodes - numMasters;
        options.push(Ember.Object.create({label: `${numMasters} masters / ${numWorkerNodes} workers`, value: numMasters}));
      }
    }

    this.set('nodeRatioOptions', options);
  },

  actions: {
    nodeRatioChanged(numMasterNodes) {
      this.set('numMasterNodes', numMasterNodes);
      this.calculateAutoNodeRatio();
    }
  }
});
