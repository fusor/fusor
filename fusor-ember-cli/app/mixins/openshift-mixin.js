import Ember from 'ember';
import {
  AllValidator,
  NumberValidator,
  IntegerValidator
} from '../utils/validators';

export default Ember.Mixin.create({

  openshiftInstallLoc: Ember.computed.alias("model.openshift_install_loc"),
  cfmeInstallLoc: Ember.computed.alias("model.cfme_install_loc"),
  isRhev: Ember.computed.alias("model.deploy_rhev"),
  isOpenStack: Ember.computed.alias("model.deploy_openstack"),
  isCloudForms: Ember.computed.alias("model.deploy_cfme"),

  positiveIntegerValidator: AllValidator.create({
    validators: [
      IntegerValidator.create({}),
      NumberValidator.create({min: 1})
    ]
  }),

  numNodes: Ember.computed.alias("model.numNodes"),
  numNodesDisplay: Ember.computed(
    'numNodes',
    'positiveIntegerValidator',
    function() {
      const numNodes = this.get('numNodes');
      const validator = this.get('positiveIntegerValidator');
      return validator.isValid(numNodes) ? numNodes : '?';
    }
  ),


  numMasterNodes: Ember.computed.alias("model.openshift_number_master_nodes"),
  numWorkerNodes: Ember.computed.alias("model.openshift_number_worker_nodes"),

  storageSize: Ember.computed.alias("model.openshift_storage_size"),

  masterVcpu: Ember.computed.alias("model.openshift_master_vcpu"),
  workerVcpu: Ember.computed.alias("model.openshift_node_vcpu"),
  cfmeVcpu: Ember.computed.alias("model.cloudforms_vcpu"),

  masterRam: Ember.computed.alias("model.openshift_master_ram"),
  workerRam: Ember.computed.alias("model.openshift_node_ram"),
  cfmeRam: Ember.computed.alias("model.cloudforms_ram"),

  masterDisk: Ember.computed.alias("model.openshift_master_disk"),
  workerDisk: Ember.computed.alias("model.openshift_node_disk"),
  cfmeDisk: Ember.computed.alias("model.cfmeDisk"),

  ignoreCfme: Ember.computed(
    "isCloudForms",
    "isRhev",
    "isOpenStack",
    "openshiftInstallLoc",
    "cfmeInstallLoc",
    function() {
      // ignore if CFME is not selected OR if both RHEV and OSP are selected
      // but locations of CFME and OSE are different
      return (!this.get('isCloudForms') ||
              (this.get('isRhev') && this.get('isOpenStack') &&
               ((this.get('openshiftInstallLoc') === 'RHEV' && this.get('cfmeInstallLoc') === 'OpenStack') ||
                (this.get('openshiftInstallLoc') === 'OpenStack' && this.get('cfmeInstallLoc') === 'RHEV'))));
    }
  ),
  substractCfme: Ember.computed.not('ignoreCfme'),

  diskAvailableMinusCfme: Ember.computed("model.openshift_available_disk", "cfmeDisk", function() {
    return this.get("model.openshift_available_disk") - this.get("cfmeDisk");
  }),

  diskAvailable: Ember.computed(
    "model.openshift_available_disk",
    "ignoreCfme",
    "diskAvailableMinusCfme",
    function() {
      if (this.get('ignoreCfme')) {
        return this.get('model.openshift_available_disk');
      } else {
        return this.get('diskAvailableMinusCfme');
      }
    }
  ),

  ramAvailableMinusCfme: Ember.computed("model.openshift_available_ram", "model.cloudforms_ram", function() {
    const rawVal = this.get("model.openshift_available_ram") - this.get("model.cloudforms_ram");
    return Math.round(rawVal * 100) / 100; // Make sure to truncate since we can get some weird fp nums
  }),

  ramAvailable: Ember.computed(
    "model.openshift_available_ram",
    "ignoreCfme",
    "ramAvailableMinusCfme",
    function() {
      if (this.get('ignoreCfme')) {
        return this.get('model.openshift_available_ram');
      } else {
        return this.get('ramAvailableMinusCfme');
      }
    }
  ),

  vcpuAvailableMinusCfme: Ember.computed("model.openshift_available_vcpu", "model.cloudforms_vcpu", function() {
    return this.get("model.openshift_available_vcpu") - this.get("model.cloudforms_vcpu");
  }),

  vcpuAvailable: Ember.computed(
    "model.openshift_available_vcpu",
    "ignoreCfme",
    "vcpuAvailableMinusCfme",
    function() {
      if (this.get('ignoreCfme')) {
        return this.get('model.openshift_available_vcpu');
      } else {
        return this.get('vcpuAvailableMinusCfme');
      }
    }
  ),

  vcpuNeeded: Ember.computed('numMasterNodes', 'numWorkerNodes', 'masterVcpu', 'workerVcpu', function() {
    if ((this.get('numMasterNodes') > 0) && (this.get('masterVcpu') > 0) &&
        (this.get('numWorkerNodes') >= 0) && (this.get('workerVcpu') > 0) ) {
      return ((this.get('numMasterNodes') * this.get('masterVcpu')) +
              (this.get('numWorkerNodes') * this.get('workerVcpu')));
    } else {
      return 0;
    }
  }),

  ramNeeded: Ember.computed('numMasterNodes', 'numWorkerNodes', 'masterRam', 'workerRam', function() {
    if ((this.get('numMasterNodes') > 0) && (this.get('masterRam') > 0) &&
        (this.get('numWorkerNodes') >= 0) && (this.get('workerRam') > 0) ) {
      return ((this.get('numMasterNodes') * this.get('masterRam')) +
               (this.get('numWorkerNodes') * this.get('workerRam')));
    } else {
      return 0;
    }
  }),

  diskNeeded: Ember.computed('numMasterNodes', 'numWorkerNodes', 'masterDisk', 'workerDisk', 'storageSize', function() {
    if ((this.get('numMasterNodes') > 0) && (this.get('masterDisk') > 0) &&
        (this.get('numWorkerNodes') >= 0) && (this.get('workerDisk') > 0) && (this.get('storageSize') > 0)) {
      return ((this.get('numMasterNodes') * this.get('masterDisk')) +
              (this.get('numWorkerNodes') * this.get('workerDisk')) +
              (this.get('numWorkerNodes') * this.get('storageSize')));
    } else {
      return 0;
    }
  }),

  isOverCapacityVcpu: Ember.computed('vcpuNeeded','vcpuAvailable', function() {
    return (this.get('vcpuNeeded') > this.get('vcpuAvailable'));
  }),
  isOverCapacityRam: Ember.computed('ramNeeded','ramAvailable', function() {
    return (this.get('ramNeeded') > this.get('ramAvailable'));
  }),
  isOverCapacityDisk: Ember.computed('diskNeeded','diskAvailable', function() {
    return (this.get('diskNeeded') > this.get('diskAvailable'));
  }),

  errorTypes: Ember.computed('isOverCapacityVcpu','isOverCapacityRam', 'isOverCapacityDisk', function() {
    let errorTypes = [];
    if (this.get('isOverCapacityVcpu')) {
      errorTypes.push('vCPU');
    }
    if (this.get('isOverCapacityRam')) {
      errorTypes.push('RAM');
    }
    if (this.get('isOverCapacityDisk')) {
      errorTypes.push('Disk');
    }
    return errorTypes.join(', ');
  }),

  isError: Ember.computed('isOverCapacityVcpu','isOverCapacityRam', 'isOverCapacityDisk', function() {
    return (this.get('isOverCapacityVcpu') || this.get('isOverCapacityRam') || this.get('isOverCapacityDisk'));
  }),

  errorMsg: Ember.computed('isError', 'errorTypes', function() {
    if (this.get('isError')) {
      return `${this.get('errorTypes')} is overcommitted. Consider lowering node counts or ${this.get('errorTypes')} sizes.`;
    }
  })
});
