import Ember from 'ember';

export default Ember.Mixin.create({

  openshiftInstallLoc: Ember.computed.alias("model.openshift_install_loc"),
  cfmeInstallLoc: Ember.computed.alias("model.cfme_install_loc"),
  isRhev: Ember.computed.alias("model.deploy_rhev"),
  isOpenStack: Ember.computed.alias("model.deploy_openstack"),
  isCloudForms: Ember.computed.alias("model.deploy_cfme"),

  numNodes: Ember.computed.alias("model.numNodes"),
  numMasterNodes: Ember.computed.alias("model.openshift_number_master_nodes"),
  numWorkerNodes: Ember.computed.alias("model.openshift_number_worker_nodes"),

  storageSize: Ember.computed.alias("model.openshift_storage_size"),

  masterVcpu: Ember.computed.alias("model.openshift_master_vcpu"),
  nodeVcpu: Ember.computed.alias("model.openshift_node_vcpu"),
  cfmeVcpu: Ember.computed.alias("model.cloudforms_vcpu"),

  masterRam: Ember.computed.alias("model.openshift_master_ram"),
  nodeRam: Ember.computed.alias("model.openshift_node_ram"),
  cfmeRam: Ember.computed.alias("model.cloudforms_ram"),

  masterDisk: Ember.computed.alias("model.openshift_master_disk"),
  nodeDisk: Ember.computed.alias("model.openshift_node_disk"),
  cfmeDisk: Ember.computed.alias("model.cfmeDisk"),

  ignoreCfme: Ember.computed("isCloudForms", "isRhev", "isOpenStack",
                             "openshiftInstallLoc", "cfmeInstallLoc", function() {
    // ignore if CFME is not selected OR if both RHEV and OSP are selected
    // but locations of CFME and OSE are different
    return (!this.get('isCloudForms') ||
            (this.get('isRhev') && this.get('isOpenStack') &&
             ((this.get('openshiftInstallLoc') === 'RHEV' && this.get('cfmeInstallLoc') === 'OpenStack') ||
              (this.get('openshiftInstallLoc') === 'OpenStack' && this.get('cfmeInstallLoc') === 'RHEV'))));
  }),
  substractCfme: Ember.computed.not('ignoreCfme'),

  diskAvailableMinusCfme: Ember.computed("model.openshift_available_disk", "cfmeDisk", function() {
    return this.get("model.openshift_available_disk") - this.get("cfmeDisk");
  }),

  diskAvailable: Ember.computed("model.openshift_available_disk",
                                "ignoreCfme",
                                "diskAvailableMinusCfme", function() {
    if (this.get('ignoreCfme')) {
      return this.get('model.openshift_available_disk');
    } else {
      return this.get('diskAvailableMinusCfme');
    }
  }),

  ramAvailableMinusCfme: Ember.computed("model.openshift_available_ram", "model.cloudforms_ram", function() {
    return this.get("model.openshift_available_ram") - this.get("model.cloudforms_ram");
  }),

  ramAvailable: Ember.computed("model.openshift_available_ram",
                                "ignoreCfme",
                                "ramAvailableMinusCfme", function() {
    if (this.get('ignoreCfme')) {
      return this.get('model.openshift_available_ram');
    } else {
      return this.get('ramAvailableMinusCfme');
    }
  }),

  vcpuAvailableMinusCfme: Ember.computed("model.openshift_available_vcpu", "model.cloudforms_vcpu", function() {
    return this.get("model.openshift_available_vcpu") - this.get("model.cloudforms_vcpu");
  }),

  vcpuAvailable: Ember.computed("model.openshift_available_vcpu",
                                "ignoreCfme",
                                "vcpuAvailableMinusCfme", function() {
    if (this.get('ignoreCfme')) {
      return this.get('model.openshift_available_vcpu');
    } else {
      return this.get('vcpuAvailableMinusCfme');
    }
  }),

  vcpuNeeded: Ember.computed('numMasterNodes', 'numWorkerNodes', 'masterVcpu', 'nodeVcpu', function() {
    if ((this.get('numMasterNodes') > 0) && (this.get('masterVcpu') > 0) &&
        (this.get('numWorkerNodes') >= 0) && (this.get('nodeVcpu') > 0) ) {
      return ((this.get('numMasterNodes') * this.get('masterVcpu')) +
              (this.get('numWorkerNodes') * this.get('nodeVcpu')));
    } else {
      return 0;
    }
  }),

  ramNeeded: Ember.computed('numMasterNodes', 'numWorkerNodes', 'masterRam', 'nodeRam', function() {
    if ((this.get('numMasterNodes') > 0) && (this.get('masterRam') > 0) &&
        (this.get('numWorkerNodes') >= 0) && (this.get('nodeRam') > 0) ) {
      return ((this.get('numMasterNodes') * this.get('masterRam')) +
               (this.get('numWorkerNodes') * this.get('nodeRam')));
    } else {
      return 0;
    }
  }),

  diskNeeded: Ember.computed('numMasterNodes', 'numWorkerNodes', 'masterDisk', 'nodeDisk', 'storageSize', function() {
    if ((this.get('numMasterNodes') > 0) && (this.get('masterDisk') > 0) &&
        (this.get('numWorkerNodes') >= 0) && (this.get('nodeDisk') > 0) && (this.get('storageSize') > 0)) {
      return ((this.get('numMasterNodes') * this.get('masterDisk')) +
              (this.get('numWorkerNodes') * this.get('nodeDisk')) +
              (this.get('numWorkerNodes') * this.get('storageSize')));
    } else {
      return 0;
    }
  }),

  vcpu1Needed: Ember.computed('masterVcpu', function() {
      return parseInt(this.get('masterVcpu'));
  }),
  vcpu2Needed: Ember.computed('vcpu1Needed', 'nodeVcpu', function() {
      return this.get('vcpu1Needed') + parseInt(this.get('nodeVcpu'));
  }),
  vcpu3Needed: Ember.computed('vcpu2Needed', 'nodeVcpu', function() {
      return this.get('vcpu2Needed') + parseInt(this.get('nodeVcpu'));
  }),
  vcpu4Needed: Ember.computed('vcpu3Needed', 'nodeVcpu', function() {
      return this.get('vcpu3Needed') + parseInt(this.get('nodeVcpu'));
  }),
  vcpu5Needed: Ember.computed('vcpu4Needed', 'nodeVcpu', function() {
      return this.get('vcpu4Needed') + parseInt(this.get('nodeVcpu'));
  }),

  ram1Needed: Ember.computed('masterRam', function() {
      return parseInt(this.get('masterRam'));
  }),
  ram2Needed: Ember.computed('ram1Needed', 'nodeRam', function() {
      return this.get('ram1Needed') + parseInt(this.get('nodeRam'));
  }),
  ram3Needed: Ember.computed('ram2Needed', 'nodeRam', function() {
      return this.get('ram2Needed') + parseInt(this.get('nodeRam'));
  }),
  ram4Needed: Ember.computed('ram3Needed', 'nodeRam', function() {
      return this.get('ram3Needed') + parseInt(this.get('nodeRam'));
  }),
  ram5Needed: Ember.computed('ram4Needed', 'nodeRam', function() {
      return this.get('ram4Needed') + parseInt(this.get('nodeRam'));
  }),

  disk1Needed: Ember.computed('masterDisk', function() {
      return parseInt(this.get('masterDisk'));
  }),
  disk2Needed: Ember.computed('disk1Needed', 'nodeDisk', function() {
      return this.get('disk1Needed') + parseInt(this.get('nodeDisk'));
  }),
  disk3Needed: Ember.computed('disk2Needed', 'nodeDisk', function() {
      return this.get('disk2Needed') + parseInt(this.get('nodeDisk'));
  }),
  disk4Needed: Ember.computed('disk3Needed', 'nodeDisk', function() {
      return this.get('disk3Needed') + parseInt(this.get('nodeDisk'));
  }),
  disk5Needed: Ember.computed('disk4Needed', 'nodeDisk', function() {
      return this.get('disk4Needed') + parseInt(this.get('nodeDisk'));
  }),

  isVcpu1OverCapacity: Ember.computed('vcpu1Needed', 'vcpuAvailable', function() {
      return (this.get('vcpu1Needed') > this.get('vcpuAvailable'));
  }),
  isVcpu2OverCapacity: Ember.computed('vcpu2Needed', 'vcpuAvailable', function() {
      return (this.get('vcpu2Needed') > this.get('vcpuAvailable'));
  }),
  isVcpu3OverCapacity: Ember.computed('vcpu3Needed', 'vcpuAvailable', function() {
      return (this.get('vcpu3Needed') > this.get('vcpuAvailable'));
  }),
  isVcpu4OverCapacity: Ember.computed('vcpu4Needed', 'vcpuAvailable', function() {
      return (this.get('vcpu4Needed') > this.get('vcpuAvailable'));
  }),
  isVcpu5OverCapacity: Ember.computed('vcpu5Needed', 'vcpuAvailable', function() {
      return (this.get('vcpu5Needed') > this.get('vcpuAvailable'));
  }),

  isRam1OverCapacity: Ember.computed('ram1Needed', 'ramAvailable', function() {
      return (this.get('ram1Needed') > this.get('ramAvailable'));
  }),
  isRam2OverCapacity: Ember.computed('ram2Needed', 'ramAvailable', function() {
      return (this.get('ram2Needed') > this.get('ramAvailable'));
  }),
  isRam3OverCapacity: Ember.computed('ram3Needed', 'ramAvailable', function() {
      return (this.get('ram3Needed') > this.get('ramAvailable'));
  }),
  isRam4OverCapacity: Ember.computed('ram4Needed', 'ramAvailable', function() {
      return (this.get('ram4Needed') > this.get('ramAvailable'));
  }),
  isRam5OverCapacity: Ember.computed('ram5Needed', 'ramAvailable', function() {
      return (this.get('ram5Needed') > this.get('ramAvailable'));
  }),

  isDisk1OverCapacity: Ember.computed('disk1Needed', 'diskAvailable', function() {
      return (this.get('disk1Needed') > this.get('diskAvailable'));
  }),
  isDisk2OverCapacity: Ember.computed('disk2Needed', 'diskAvailable', function() {
      return (this.get('disk2Needed') > this.get('diskAvailable'));
  }),
  isDisk3OverCapacity: Ember.computed('disk3Needed', 'diskAvailable', function() {
      return (this.get('disk3Needed') > this.get('diskAvailable'));
  }),
  isDisk4OverCapacity: Ember.computed('disk4Needed', 'diskAvailable', function() {
      return (this.get('disk4Needed') > this.get('diskAvailable'));
  }),
  isDisk5OverCapacity: Ember.computed('disk5Needed', 'diskAvailable', function() {
      return (this.get('disk5Needed') > this.get('diskAvailable'));
  }),

  isOver1Capacity: Ember.computed('isVcpu1OverCapacity',
                                 'isRam1OverCapacity',
                                 'isDisk1OverCapacity', function() {
      return (this.get('isVcpu1OverCapacity') ||
              this.get('isRam1OverCapacity') ||
              this.get('isDisk1OverCapacity'));
  }),
  isOver2Capacity: Ember.computed('isVcpu2OverCapacity',
                                 'isRam2OverCapacity',
                                 'isDisk2OverCapacity', function() {
      return (this.get('isVcpu2OverCapacity') ||
              this.get('isRam2OverCapacity') ||
              this.get('isDisk2OverCapacity'));
  }),
  isOver3Capacity: Ember.computed('isVcpu3OverCapacity',
                                 'isRam3OverCapacity',
                                 'isDisk3OverCapacity', function() {
      return (this.get('isVcpu3OverCapacity') ||
              this.get('isRam3OverCapacity') ||
              this.get('isDisk3OverCapacity'));
  }),
  isOver4Capacity: Ember.computed('isVcpu4OverCapacity',
                                 'isRam4OverCapacity',
                                 'isDisk4OverCapacity', function() {
      return (this.get('isVcpu4OverCapacity') ||
              this.get('isRam4OverCapacity') ||
              this.get('isDisk4OverCapacity'));
  }),
  isOver5Capacity: Ember.computed('isVcpu5OverCapacity',
                                 'isRam5OverCapacity',
                                 'isDisk5OverCapacity', function() {
      return (this.get('isVcpu5OverCapacity') ||
              this.get('isRam5OverCapacity') ||
              this.get('isDisk5OverCapacity'));
  }),


});
