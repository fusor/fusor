import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import OpenshiftMixin from "../../mixins/openshift-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, OpenshiftMixin, {

  openshiftController: Ember.inject.controller('openshift'),

  // similar code to CFME where-install.js. Possible to DRY into mixin
  isRhev: Ember.computed.alias("deploymentController.isRhev"),
  isNotRhev: Ember.computed.not("isRhev"),
  isOpenStack: Ember.computed.alias("deploymentController.isOpenStack"),
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

  backRouteName: Ember.computed('isOpenStack', 'isRhev', function() {
    if (this.get('isOpenStack')) {
      return 'openstack.overcloud';
    } else if (this.get('isRhev')) {
      return 'storage';
    } else {
      return 'satellite.access-insights';
    }
  }),

  showEnvironmentSummary: Ember.computed('numNodes', 'storageSize', function() {
    return (Ember.isPresent(this.get('numNodes')) && Ember.isPresent(this.get('storageSize')));
  }),

  actions: {
    openshiftLocationChanged() {},

    numMasterNodesChanged(numNodes) {
      this.set('isCustomNumMasterNodes', false);
      this.set('numMasterNodes', numNodes);
    },

    numWorkerNodesChanged(numNodes) {
      this.set('isCustomNumWorkerNodes', false);
      this.set('numWorkerNodes', numNodes);
    },

    storageSizeChanged(storageSize) {
      this.set('isCustomStorageSize', false);
      this.set('model.openshift_storage_size', storageSize);
    },

    showCustomNumWorkerNodes() {
      this.set('isCustomNumWorkerNodes', true);
    },

    showCustomStorageSize() {
      this.set('isCustomStorageSize', true);
    }
  },

  _initWorkerNodes(count) {
    const _workerNodes = Ember.A([]);
    const _workerNodesMinusFirst = Ember.A([]);

    for(let nodeOrdinal = 1; nodeOrdinal <= count; ++nodeOrdinal) {
      const _node = this._createWorkerNode(nodeOrdinal);
      _workerNodes.push(_node);

      if(nodeOrdinal === 1) {
        this.set('_firstWorkerNode', _node);
      } else {
        _workerNodesMinusFirst.push(_node);
      }
    }

    this.set('_workerNodes', _workerNodes);
    this.set('_workerNodesMinusFirst', _workerNodesMinusFirst);
  },

  _createWorkerNode(ordinal) {
    const WorkerNode = Ember.Object.extend({
      numMasterNodes: Ember.computed.alias('controller.numMasterNodes'),

      perMasterVcpu: Ember.computed.alias('controller.masterVcpu'),
      perMasterRam: Ember.computed.alias('controller.masterRam'),
      perMasterDisk: Ember.computed.alias('controller.masterDisk'),
      perWorkerVcpu: Ember.computed.alias('controller.model.openshift_node_vcpu'),
      perWorkerRam: Ember.computed.alias('controller.model.openshift_node_ram'),
      perWorkerDisk: Ember.computed.alias('controller.storageSize'),

      vcpuAvailable: Ember.computed.alias('controller.vcpuAvailable'),
      ramAvailable: Ember.computed.alias('controller.ramAvailable'),
      diskAvailable: Ember.computed.alias('controller.diskAvailable'),

      vcpuNeeded: Ember.computed(
        'ordinal',
        'numMasterNodes',
        'perMasterVcpu',
        'perWorkerVcpu',
        function() {
          const totalWorkerCpu = this.get('ordinal') * this.get('perWorkerCpu');
          const totalMasterCpu = this.get('numMasterNodes') * this.get('perMasterVcpu');
          return totalWorkerCpu + totalMasterCpu;
        }
      ),

      ramNeeded: Ember.computed(
        'ordinal',
        'numMasterNodes',
        'perMasterRam',
        'perWorkerRam',
        function() {
          const totalWorkerRam = this.get('ordinal') * this.get('perWorkerRam');
          const totalMasterRam = this.get('numMasterNodes') * this.get('perMasterRam');
          return totalWorkerRam + totalMasterRam;
        }
      ),

      diskNeeded: Ember.computed(
        'ordinal',
        'numMasterNodes',
        'perMasterDisk',
        'perWorkerDisk',
        function() {
          const totalWorkerDisk = this.get('ordinal') * this.get('perWorkerDisk');
          const totalMasterDisk = this.get('numMasterNodes') * this.get('perMasterDisk');
          return totalWorkerDisk + totalMasterDisk;
        }
      ),

      isOverCapacity: Ember.computed(
        'vcpuNeeded',
        'vcpuAvailable',
        'ramNeeded',
        'ramAvailable',
        'diskNeeded',
        'diskAvailable',
        function() {
          const vcpuOver = this.get('vcpuNeeded') > this.get('vcpuAvailable');
          const ramOver = this.get('ramNeeded') > this.get('ramAvailable');
          const diskOver = this.get('diskNeeded') > this.get('diskAvailable');
          return vcpuOver || ramOver || diskOver;
        }
      )
    });

    return WorkerNode.create({
      controller: this,
      ordinal: ordinal
    });
  }
});
