import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import OpenshiftMixin from "../../mixins/openshift-mixin";
import { AllValidator, PresenceValidator, NumberValidator, IntegerValidator } from '../../utils/validators';

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

  positiveIntegerValidator: AllValidator.create({
    validators: [
      IntegerValidator.create({}),
      NumberValidator.create({min: 1})
    ]
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

    showCustomNumMasterNodes() {
      this.set('isCustomNumMasterNodes', true);
    },

    showCustomNumWorkerNodes() {
      this.set('isCustomNumWorkerNodes', true);
    },

    showCustomStorageSize() {
      this.set('isCustomStorageSize', true);
    }
  }

});
