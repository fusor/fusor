import Ember from 'ember';
import NeedsDeploymentMixin from "./needs-deployment-mixin";
import {
  AllValidator,
  NumberValidator,
  IntegerValidator
} from '../utils/validators';

export default Ember.Mixin.create(NeedsDeploymentMixin, {

  deployment: Ember.computed.alias('deploymentController.model'),
  openshiftInstallLoc: Ember.computed.alias("deployment.openshift_install_loc"),
  cfmeInstallLoc: Ember.computed.alias("deployment.cfme_install_loc"),
  isRhev: Ember.computed.alias("deployment.deploy_rhev"),
  isOpenStack: Ember.computed.alias("deployment.deploy_openstack"),
  isCloudForms: Ember.computed.alias("deployment.deploy_cfme"),

  positiveIntegerValidator: AllValidator.create({
    validators: [
      IntegerValidator.create({}),
      NumberValidator.create({min: 1})
    ]
  }),

  numNodes: Ember.computed.alias("deployment.numNodes"),
  numNodesDisplay: Ember.computed(
    'numNodes',
    'positiveIntegerValidator',
    function() {
      const numNodes = this.get('numNodes');
      const validator = this.get('positiveIntegerValidator');
      return validator.isValid(numNodes) ? numNodes : '?';
    }
  ),

  hypervisorReservedRam: 4,

  numMasterNodes: Ember.computed.alias("deployment.openshift_number_master_nodes"),
  numWorkerNodes: Ember.computed.alias("deployment.openshift_number_worker_nodes"),

  storageSize: Ember.computed.alias("deployment.openshift_storage_size"),

  masterVcpu: Ember.computed.alias("deployment.openshift_master_vcpu"),
  workerVcpu: Ember.computed.alias("deployment.openshift_node_vcpu"),
  cfmeVcpu: Ember.computed.alias("deployment.cloudforms_vcpu"),

  masterRam: Ember.computed.alias("deployment.openshift_master_ram"),
  workerRam: Ember.computed.alias("deployment.openshift_node_ram"),
  cfmeRam: Ember.computed.alias("deployment.cloudforms_ram"),

  masterDisk: Ember.computed.alias("deployment.openshift_master_disk"),
  workerDisk: Ember.computed.alias("deployment.openshift_node_disk"),
  cfmeDisk: Ember.computed.alias("deployment.cfmeDisk"),

  totalMasterCpus: Ember.computed('numMasterNodes', 'masterVcpu', function() {
    return this.get('numMasterNodes') * this.get('masterVcpu');
  }),

  totalWorkerCpus: Ember.computed('numWorkerNodes', 'workerVcpu', function() {
    return this.get('numWorkerNodes') * this.get('workerVcpu');
  }),

  totalMasterRam: Ember.computed('numMasterNodes', 'masterRam', function() {
    return this.get('numMasterNodes') * this.get('masterRam');
  }),

  totalWorkerRam: Ember.computed('numWorkerNodes', 'workerRam', function() {
    return this.get('numWorkerNodes') * this.get('workerRam');
  }),

  totalMasterDisk: Ember.computed('numMasterNodes', 'masterDisk', function() {
    return this.get('numMasterNodes') * this.get('masterDisk');
  }),

  totalWorkerDisk: Ember.computed('numWorkerNodes', 'workerDisk', function() {
    return this.get('numWorkerNodes') * this.get('workerDisk');
  }),

  totalWorkerStorage: Ember.computed('numWorkerNodes', 'storageSize', function() {
    return this.get('numWorkerNodes') * this.get('storageSize');
  }),

  totalWorkerDiskPlusStorage: Ember.computed(
    'totalWorkerDisk',
    'totalWorkerStorage',
    function() {
      return this.get('totalWorkerDisk') + this.get('totalWorkerStorage');
    }
  ),

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

  diskAvailableMinusCfme: Ember.computed("deployment.openshift_available_disk", "cfmeDisk", function() {
    const rawDisk = this.get("deployment.openshift_available_disk") - this.get("cfmeDisk");
    return Math.floor(rawDisk * 100) / 100;
  }),

  diskAvailable: Ember.computed(
    "deployment.openshift_available_disk",
    "ignoreCfme",
    "diskAvailableMinusCfme",
    function() {
      if (this.get('ignoreCfme')) {
        return this.get('deployment.openshift_available_disk');
      } else {
        return this.get('diskAvailableMinusCfme');
      }
    }
  ),

  ramAvailableMinusCfme: Ember.computed("deployment.openshift_available_ram", "deployment.cloudforms_ram", function() {
    const rawVal = this.get("deployment.openshift_available_ram") - this.get("deployment.cloudforms_ram");
    return Math.floor(rawVal * 100) / 100; // Make sure to truncate since we can get some weird fp nums
  }),

  ramAvailable: Ember.computed(
    "deployment.openshift_available_ram",
    "ignoreCfme",
    "ramAvailableMinusCfme",
    function() {
      let rawRam;
      if (this.get('ignoreCfme')) {
        rawRam = this.get('deployment.openshift_available_ram');
      } else {
        rawRam = this.get('ramAvailableMinusCfme');
      }
      const availableRam = rawRam - this.get('hypervisorReservedRam');
      return availableRam;
    }
  ),

  vcpuAvailableMinusCfme: Ember.computed("deployment.openshift_available_vcpu", "deployment.cloudforms_vcpu", function() {
    const cpuLessCfme = this.get("deployment.openshift_available_vcpu") - this.get("deployment.cloudforms_vcpu");
    // Clamp to zero
    return Math.max(cpuLessCfme, 0);
  }),

  vcpuAvailable: Ember.computed(
    "deployment.openshift_available_vcpu",
    "ignoreCfme",
    "vcpuAvailableMinusCfme",
    function() {
      if (this.get('ignoreCfme')) {
        return this.get('deployment.openshift_available_vcpu');
      } else {
        return this.get('vcpuAvailableMinusCfme');
      }
    }
  ),

  vcpuNeeded: Ember.computed(
    'numMasterNodes',
    'numWorkerNodes',
    'masterVcpu',
    'workerVcpu',
    'totalMasterCpus',
    'totalWorkerCpus',
    function() {
      if ((this.get('numMasterNodes') > 0) && (this.get('masterVcpu') > 0) &&
          (this.get('numWorkerNodes') >= 0) && (this.get('workerVcpu') > 0) ) {
        return this.get('totalMasterCpus') + this.get('totalWorkerCpus');
      } else {
        return 0;
      }
    }
  ),

  ramNeeded: Ember.computed(
    'numMasterNodes',
    'numWorkerNodes',
    'masterRam',
    'workerRam',
    'totalMasterRam',
    'totalWorkerRam',
    function() {
      if ((this.get('numMasterNodes') > 0) && (this.get('masterRam') > 0) &&
          (this.get('numWorkerNodes') >= 0) && (this.get('workerRam') > 0) ) {
        return this.get('totalMasterRam') + this.get('totalWorkerRam');
      } else {
        return 0;
      }
    }
  ),

  diskNeeded: Ember.computed(
    'numMasterNodes',
    'masterDisk',
    'numWorkerNodes',
    'workerDisk',
    'storageSize',
    'totalMasterDisk',
    'totalWorkerDiskPlusStorage',
    function() {
      const hasMasterDisk = this.get('numMasterNodes') > 0 && this.get('masterDisk') > 0;
      const hasWorkerDiskPlusStorage =
        this.get('numWorkerNodes') >= 0 &&
        this.get('workerDisk') > 0 &&
        this.get('storageSize') > 0;
      const shouldPerformDiskCalc = hasMasterDisk && hasWorkerDiskPlusStorage;

      return shouldPerformDiskCalc ?
        this.get('totalMasterDisk') + this.get('totalWorkerDiskPlusStorage') : 0;
    }
  ),

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
      errorTypes.push('CPU');
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

  cfmeTooltipError: Ember.computed(
    'cfmeVcpu',
    'cfmeRam',
    'cfmeDisk',
    function() {
      const ramErrorMsg =
        `CloudForms has reserved ${this.get('cfmeRam')}GB. The hypervisor requires 4GB of overhead.`;

      return Ember.Object.create({
        cpu: `CloudForms has ${this.get('cfmeVcpu')} reserved cpus`,
        ram: ramErrorMsg,
        disk: `CloudForms has reserved ${this.get('cfmeDisk')} GB of disk`
      });
    }
  )
});
