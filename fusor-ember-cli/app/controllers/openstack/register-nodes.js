import Ember from 'ember';
import request from 'ic-ajax';
import ProgressBarMixin from "../../mixins/progress-bar-mixin";
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

import {
  AllValidator,
  UniquenessValidator,
  MacAddressValidator,
  HostAddressValidator,
  PresenceValidator
} from  "../../utils/validators";

const RegisterNodesController = Ember.Controller.extend(ProgressBarMixin, NeedsDeploymentMixin, {
  deploymentId: Ember.computed.alias("deploymentController.model.id"),
  deployment: Ember.computed.alias("deploymentController.model"),
  openstackDeployment: Ember.computed.alias("model"),
  intervalPolling: 10000,

  presenceValidator: PresenceValidator.create({}),

  unavailableMacs: Ember.computed('ports', 'nodeInfo.macAddresses.@each.value', function () {
    let enteredMacs = this.get('nodeInfo.macAddresses');
    let unavailableMacs = this.getPortMacAddresses();

    if (enteredMacs) {
      enteredMacs.forEach(mac => { unavailableMacs.pushObject(mac.value); });
    }

    return unavailableMacs;
  }),

  macAddressValidator: Ember.computed('unavailableMacs', function () {
    return AllValidator.create({
      validators: [
        MacAddressValidator.create({}),
        UniquenessValidator.create({selfIncluded: true, existingValues: this.get('unavailableMacs')})
      ]
    });
  }),

  hostAddressValidator: AllValidator.create({
    validators: [
      PresenceValidator.create({}),
      HostAddressValidator.create({})
    ]
  }),

  step: 1,
  detectNodesRequestNum: 0,
  savedInfo: [],
  csvInfo: [],
  csvErrors: [],

  drivers: [
    {label: 'IPMI Driver', value: 'pxe_ipmitool'},
    {label: 'PXE + SSH', value: 'pxe_ssh'}
  ],

  ipmiVendors: [
    {label: 'Dell', value: 'dell'}
  ],

  ipmiVendor: 'dell',

  virtVendors: [
    {label: 'KVM', value: 'kvm'}
  ],

  virtVendor: 'kvm',

  vendors: Ember.computed('nodeInfo.driver', function () {
    switch (this.get('nodeInfo.driver')) {
    case 'pxe_ssh':
      return this.get('virtVendors');
    case 'pxe_ipmitool':
      return this.get('ipmiVendors');
    default:
      return [];
    }
  }),

  isStep1: Ember.computed('step', function() {
    return this.get('step') === 1;
  }),

  isStep2: Ember.computed('step', function() {
    return this.get('step') === 2;
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

  nodeDriverHumanized: Ember.computed('nodeInfo.driver', function () {
    return this.get('drivers').findBy('value', this.get('nodeInfo.driver')).label;
  }),

  isPxeSsh: Ember.computed('nodeInfo.driver', function() {
    return this.get('nodeInfo.driver') === 'pxe_ssh';
  }),

  isIpmi: Ember.computed('nodeInfo.driver', function() {
    return this.get('nodeInfo.driver') === 'pxe_ipmitool';
  }),

  newNodeVendorLabel: Ember.computed('nodeInfo.driver', function () {
    if (this.get('nodeInfo.driver') === 'pxe_ipmitool') {
      return 'IPMI Vendor';
    }

    return 'Vendor';
  }),

  newNodeAddressLabel: Ember.computed('nodeInfo.driver', function () {
    switch (this.get('nodeInfo.driver')) {
    case 'pxe_ssh':
      return 'SSH Address';
    case 'pxe_ipmitool':
      return 'IPMI Address';
    default:
      return 'Address';
    }
  }),

  newNodeUsernameLabel: Ember.computed('nodeInfo.driver', function () {
    switch (this.get('nodeInfo.driver')) {
    case 'pxe_ssh':
      return 'SSH User';
    case 'pxe_ipmitool':
      return 'IPMI User';
    default:
      return 'Username';
    }
  }),

  newNodePasswordLabel: Ember.computed('nodeInfo.driver', function () {
    switch (this.get('nodeInfo.driver')) {
    case 'pxe_ssh':
      return 'SSH Password';
    case 'pxe_ipmitool':
      return 'IPMI Password';
    default:
      return 'Password';
    }
  }),

  hasNodes: Ember.computed('openstackDeployment.overcloud_node_count', function() {
    return this.get('openstackDeployment.overcloud_node_count') > 0;
  }),

  nodeErrors: Ember.computed(
    'nodeManagers.[]',
    'nodes.@each',
    'introspectionTasks.@each',
    'foremanTasks.@each.humanized_errors',
    'ports.@each',
    function () {
      let nodeManagers = this.get('nodeManagers') || [];
      let foremanTasks = this.get('foremanTasks') || [];
      let nodeErrors = [];
      nodeManagers.forEach((manager) => {
        manager.get('nodes').forEach((node) => {
          let nodeError = this.getNodeError(manager, node);
          if (nodeError) {
            nodeErrors.pushObject(nodeError);
          }
        });
      });

      return nodeErrors;
    }),

  showNodeErrors: Ember.computed('nodeErrors', function() {
    return Ember.isPresent(this.get('nodeErrors'));
  }),

  registrationErrors: Ember.computed(
    'newIntrospectionTaskIds.@each',
    'foremanTasks.@each.humanized_errors',
    'introspectionTasks.[]',
    'nodes.[]',
    function () {
      let newIntrospectionTaskIds = this.get('newIntrospectionTaskIds') || [];
      let foremanTasks = this.get('foremanTasks') || [];
      let registrationErrors = [];

      newIntrospectionTaskIds.forEach((taskId) => {
        let registrationError = this.getRegistrationError(taskId);
        if (registrationError) {
          registrationErrors.pushObject(registrationError);
        }
      });

      return registrationErrors;
    }),

  showRegistrationErrors: Ember.computed('registrationErrors', function() {
    return Ember.isPresent(this.get('registrationErrors'));
  }),

  hasCsvInfo: Ember.computed('csvInfo.[]', function() {
    return Ember.isPresent(this.get('csvInfo'));
  }),

  hasCsvErrors: Ember.computed('csvErrors.[]', function() {
    return Ember.isPresent(this.get('csvErrors'));
  }),

  hasAutoDetectedNodesMultiMac: Ember.computed('autoDetectedNodesMultiMac.[]', function () {
    return this.get('autoDetectedNodesMultiMac.length') > 0;
  }),

  hasAutoDetectedNodesSingleMac: Ember.computed('autoDetectedNodesSingleMac.[]', function () {
    return this.get('autoDetectedNodesSingleMac.length') > 0;
  }),

  hasAutoDetectedNodes: Ember.computed('hasAutoDetectedNodesMultiMac', 'hasAutoDetectedNodesSingleMac', function() {
    return this.get('hasAutoDetectedNodesMultiMac') && this.get('hasAutoDetectedNodesSingleMac');
  }),

  noNodesDetected: Ember.computed('hasAutoDetectedNodes', 'detectNodesCanceled', function() {
    return !this.get('hasAutoDetectedNodes') && !this.get('detectNodesCanceled');
  }),

  numAutoDetectedNodesInvalidCount: Ember.computed(
    'autoDetectedNodesMultiMac.@each.value',
    'autoDetectedNodesMultiMac.@each.selected',
    'autoDetectedNodesSingleMac.@each.value',
    'autoDetectedNodesSingleMac.@each.selected',
    function() {
      return this.countAutoDetectedNodes(node => node.get('selected') && !Ember.isPresent(node.get('value')));
    }
  ),

  hasInvalidAutoDetectedNodes: Ember.computed('numAutoDetectedNodesInvalidCount', function() {
    return this.get('numAutoDetectedNodesInvalidCount') > 0;
  }),

  numAutoDetectedNodesDeselectedCount: Ember.computed(
    'autoDetectedNodesMultiMac.@each.selected',
    'autoDetectedNodesSingleMac.@each.selected',
    function() {
      return this.countAutoDetectedNodes(node => !node.get('selected'));
    }
  ),

  hasDeselectedAutoDetectedNodes: Ember.computed('numAutoDetectedNodesDeselectedCount', function() {
    return this.get('numAutoDetectedNodesDeselectedCount') > 0;
  }),

  numAutoDetectedNodesValidCount: Ember.computed(
    'autoDetectedNodesMultiMac.@each.value',
    'autoDetectedNodesMultiMac.@each.selected',
    'autoDetectedNodesSingleMac.@each.value',
    'autoDetectedNodesSingleMac.@each.selected',
    function() {
      return this.countAutoDetectedNodes(node => node.get('selected') && Ember.isPresent(node.get('value')));
    }
  ),

  countAutoDetectedNodes(matchFn) {
    let numMultiMacNodes = this.get('autoDetectedNodesMultiMac').reduce((prev, node) => prev + (matchFn(node) ? 1 : 0), 0);
    let numSingleMacNodes = this.get('autoDetectedNodesSingleMac').reduce((prev, node) => prev + (matchFn(node) ? 1 : 0), 0);

    return numMultiMacNodes + numSingleMacNodes;
  },

  hasValidAutoDetectedNodes: Ember.computed('numAutoDetectedNodesValidCount', function() {
    return this.get('numAutoDetectedNodesValidCount') > 0;
  }),

  selectedVendor:  Ember.computed('isIpmi', 'ipmiVendor', 'virtVendor', function() {
    return this.get('isIpmi') ? this.get('ipmiVendor') : this.get('virtVendor');
  }),

  isValidAutoDetectInfo: Ember.computed(
    'registerNodesMethod',
      'nodeInfo.driver',
      'nodeInfo.vendor',
      'nodeInfo.address',
      'nodeInfo.username',
      'nodeInfo.password',
      function () {
        return this.get('registerNodesMethod') === 'auto_detect' &&
          Ember.isPresent(this.get('nodeInfo.driver')) &&
          Ember.isPresent(this.get('selectedVendor')) &&
          Ember.isPresent(this.get('nodeInfo.address')) &&
          Ember.isPresent(this.get('nodeInfo.username')) &&
          Ember.isPresent(this.get('nodeInfo.password')) &&
          this.get('hostAddressValidator').isValid(this.get('nodeInfo.address'));
      }),

  isValidNewNodeAuto: Ember.computed(
    'isValidAutoDetectInfo',
    'hasInvalidAutoDetectedNodes',
    'hasValidAutoDetectedNodes',
    function () {
      if (!this.get('isValidAutoDetectInfo')) {
        return false;
      }

      let macAddresses = this.get('nodeInfo.macAddresses');
      if (!macAddresses) {
        return false;
      }

      return this.get('hasValidAutoDetectedNodes') && !this.get('hasInvalidAutoDetectedNodes');
    }),

  isValidNewNodeCsv: Ember.computed('hasCsvInfo', 'hasCsvErrors', function() {
    return this.get('hasCsvInfo') && !this.get('hasCsvErrors');
  }),

  isValidNewNodeManual: Ember.computed(
    'registerNodesMethod',
    'nodeInfo.driver',
    'nodeInfo.address',
    'nodeInfo.username',
    'nodeInfo.password',
    'nodeInfo.macAddresses.@each.value',
    function () {
      let validConnection = this.get('registerNodesMethod') === 'manual' &&
        Ember.isPresent(this.get('nodeInfo.driver')) &&
        Ember.isPresent(this.get('nodeInfo.address')) &&
        Ember.isPresent(this.get('nodeInfo.username')) &&
        Ember.isPresent(this.get('nodeInfo.password')) &&
        this.get('hostAddressValidator').isValid(this.get('nodeInfo.address'));

      if (!validConnection) {
        return false;
      }


      let macAddresses = this.get('nodeInfo.macAddresses');
      if (!macAddresses) {
        return false;
      }

      let numberInvalidMacs = 0,
        numberValidMacs = 0,
        macAddressValidator = this.get('macAddressValidator');

      macAddresses.forEach((macAddress) => {
        if (Ember.isPresent(macAddress.value)) {
          if (macAddressValidator.isValid(macAddress.value)) {
            numberValidMacs++;
          } else {
            numberInvalidMacs++;
          }
        }
      });

      return numberInvalidMacs === 0 && numberValidMacs > 0;
    }),

  hasValidNodesForRegistration: Ember.computed('isValidNewNodeAuto', 'isValidNewNodeCsv', 'isValidNewNodeManual', function() {
    return this.get('isValidNewNodeAuto') || this.get('isValidNewNodeCsv') || this.get('isValidNewNodeManual');
  }),

  disableDetectNodesSubmit: Ember.computed.not('isValidAutoDetectInfo'),

  disableNewNodesSubmit: Ember.computed.not('hasValidNodesForRegistration'),

  enableRegisterNodesNext: Ember.computed('openstackDeployment.areNodesRegistered', function() {
    return this.get('openstackDeployment.areNodesRegistered');
  }),

  disableRegisterNodesNext: Ember.computed.not('enableRegisterNodesNext'),

  actions: {
    showNodeRegistrationModal() {
      this.initInfo();
      this.openRegDialog();
    },

    backStep() {
      this.set('step', 1);
    },

    addMacAddress() {
      this.get('nodeInfo.macAddresses').pushObject(Ember.Object.create({value: ''}));
    },

    submitRegisterNodes() {
      this.submitNodes();
      this.closeRegDialog();
    },

    cancelRegisterNodes() {
      this.closeRegDialog();
    },

    csvFileChosen() {
      this.parseCsvFile(this.getCSVFileInput());
    },

    submitDetectNodes() {
      this.detectNodes();
      this.set('step', 2);
    },

    cancelDetectNodes() {
      this.set('detectNodesCanceled', true);
      this.set('autoDetectNodesInProgress', false);
      this.set('detectNodesRequestNum', this.get('detectNodesRequestNum') + 1);
      this.set('autoDetectedNodesMultiMac', []);
      this.set('autoDetectedNodesSingleMac', []);
    },

    addNodesToManager(nodeManager) {
      this.set('registerNodesMethod', 'manual');

      this.set('nodeInfo', Ember.Object.create({
        vendor:null,
        driver: nodeManager.get('driver'),
        address: nodeManager.get('address'),
        username: nodeManager.get('username'),
        password: this.getPassword(nodeManager),
        macAddresses: [Ember.Object.create({value: ''})]
      }));

      this.openAddNodeDialog();
    },

    submitAddNodes() {
      this.submitNodes();
      this.closeAddNodeDialog();
    },

    cancelAddNodes() {
      this.closeAddNodeDialog();
    },

    deleteNode(node, nodeLabel) {
      this.set('nodeToDelete', node);
      this.set('nodeToDeleteLabel', nodeLabel);
      this.set('openDeleteNodeConfirmation', true);
      this.set('closeDeleteNodeConfirmation', false);
    },

    cancelDeleteNode() {
      this.set('openDeleteNodeConfirmation', false);
      this.set('closeDeleteNodeConfirmation', true);
    },

    confirmDeleteNode() {
      this.deleteNodeRequest();
    }
  },

  initInfo() {
    this.set('registerNodesMethod', 'auto_detect');

    this.set('nodeInfo', Ember.Object.create({
      vendor: null,
      driver: null,
      address: null,
      username: null,
      password: null,
      macAddresses: [Ember.Object.create({value: ''})]
    }));

    this.set('csvInfo', []);
    this.set('csvErrors', []);
    this.set('autoDetectedNodesMultiMac', []);
    this.set('autoDetectedNodesSingleMac', []);
  },

  deleteNodeRequest() {
    let url = `/fusor/api/openstack/deployments/${this.get('deploymentId')}/nodes/${this.get('nodeToDelete.id')}`;

    this.set('openDeleteNodeConfirmation', false);
    this.set('closeDeleteNodeConfirmation', true);

    return request({
      url: url,
      type: 'DELETE',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": Ember.$('meta[name="csrf-token"]').attr('content')
      }
    }).then((result) => {
      this.removeNode(this.get('nodeToDelete'));
    }, (error) => {
      this.send('error', error, `Unable to delete node. DELETE ${url} failed with status code ${error.jqXHR.status}.`);
    });
  },

  removeNode(node) {
    let nodes = this.get('nodes');
    let nodeManagers = this.get('nodeManagers');
    nodeManagers.forEach((mgr) => {
      mgr.removeNode(node);
    });

    this.set('nodeManagers', nodeManagers.filter((mgr) => mgr.get('nodes.length') > 0));
    this.set('nodes', nodes.without(node));
  },

  openRegDialog() {
    this.set('step', 1);
    this.set('openNewNodeRegistrationModal', true);
    this.set('closeNewNodeRegistrationModal', false);
  },

  closeRegDialog() {
    this.set('openNewNodeRegistrationModal', false);
    this.set('closeNewNodeRegistrationModal', true);
  },

  openAddNodeDialog() {
    this.set('openAddNodeRegistrationModal', true);
    this.set('closeAddNodeRegistrationModal', false);
  },

  closeAddNodeDialog() {
    this.set('openAddNodeRegistrationModal', false);
    this.set('closeAddNodeRegistrationModal', true);
  },

  submitNodes() {
    let method = this.get('registerNodesMethod');
    this.set('newIntrospectionTaskIds', []);

    if (method === 'manual') {
      this.registerNodes(this.get('nodeInfo'));
    } else if (method === 'csv_upload') {
      this.get('csvInfo').forEach(nodeInfo => this.registerNodes(nodeInfo));
    } else if (method === 'auto_detect') {
      this.prepAutoDetectNodeInfo();
      this.registerNodes(this.get('nodeInfo'));
    }

    this.closeRegDialog();
  },

  registerNodes(nodeInfo) {
    nodeInfo.get('macAddresses').forEach((macAddress) => {
      if (macAddress && Ember.isPresent(macAddress.value)) {
        this.registerNode(nodeInfo, macAddress.value);
      }
    });
  },

  registerNode(nodeDriverInfo, macAddress) {
    nodeDriverInfo.set('address', nodeDriverInfo.get('address').trim());
    nodeDriverInfo.set('username', nodeDriverInfo.get('username').trim());

    let nodeParam = this.createNodeHash(nodeDriverInfo, macAddress);
    let url = `/fusor/api/openstack/deployments/${this.get('deploymentId')}/nodes`;

    return request({
      url: url,
      type: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": Ember.$('meta[name="csrf-token"]').attr('content')
      },
      data: JSON.stringify({node: nodeParam})
    }).then((result) => {
      this.get('newIntrospectionTaskIds').pushObject(result.id);
      this.get('savedInfo').unshiftObject(nodeDriverInfo);
      this.send('refreshModelOnOverviewRoute');
      this.stopPolling();
      this.startPolling();
    }, (error) => {
      this.send('error', error, `Unable to register node. POST ${url} failed with status code ${error.jqXHR.status}.`);
    });
  },

  createNodeHash(nodeInfo, macAddress) {
    let driverInfo = {};
    if (nodeInfo.get('driver') === 'pxe_ssh') {
      driverInfo = {
        ssh_address: nodeInfo.get('address'),
        ssh_username: nodeInfo.get('username'),
        ssh_password: nodeInfo.get('password'),
        ssh_virt_type: 'virsh'
      };
    } else if (nodeInfo.get('driver') === 'pxe_ipmitool') {
      driverInfo = {
        ipmi_address: nodeInfo.get('address'),
        ipmi_username: nodeInfo.get('username'),
        ipmi_password: nodeInfo.get('password')
      };
    }
    driverInfo.deploy_kernel = this.get('bmDeployKernelImage.id');
    driverInfo.deploy_ramdisk = this.get('bmDeployRamdiskImage.id');

    return {
      driver: nodeInfo.get('driver'),
      driver_info: driverInfo,
      properties: {
        capabilities: 'boot_option:local'
      },
      address: macAddress.trim()
    };
  },

  detectNodes() {
    let nodeInfo = this.get('nodeInfo');
    let detectNodesRequestNum = this.get('detectNodesRequestNum') + 1;

    nodeInfo.set('address', nodeInfo.get('address').trim());
    nodeInfo.set('username', nodeInfo.get('username').trim());
    nodeInfo.set('vendor', this.get('selectedVendor'));

    this.set('autoDetectedNodesMultiMac', []);
    this.set('autoDetectedNodesSingleMac', []);
    this.set('detectNodesRequestNum', detectNodesRequestNum);

    let driverParams = {
      driver: nodeInfo.get('driver'),
      vendor: nodeInfo.get('vendor'),
      hostname: nodeInfo.get('address'),
      username: nodeInfo.get('username'),
      password: nodeInfo.get('password')
    };

    let url = `/fusor/api/openstack/deployments/${this.get('deploymentId')}/node_mac_addresses`;

    this.set('detectNodesCanceled', false);
    this.set('autoDetectNodesInProgress', true);

    return request({
      url: url,
      type: 'POST', //GET would expose password in a query param
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": Ember.$('meta[name="csrf-token"]').attr('content')
      },
      data: JSON.stringify(driverParams)
    }).then((result) => {
      if (detectNodesRequestNum === this.get('detectNodesRequestNum')){
        this.updateAutoDetectedNodes(result.nodes);
        this.set('autoDetectNodesInProgress', false);
      }
    }, (error) => {
      console.log(error);
      if (detectNodesRequestNum === this.get('detectNodesRequestNum')) {
        this.set('detectNodesErrorMsg', `Unable to detect nodes. Failed with status code ${error.jqXHR.status}.`);
        this.set('autoDetectNodesInProgress', false);
      }
    });
  },

  updateAutoDetectedNodes(hostArray) {
    let autoDetectedNodesMultiMac = [];
    let autoDetectedNodesSingleMac = [];
    let usedMacs = this.getPortMacAddresses();

    hostArray.forEach(hostHash => {
      let host = Ember.Object.create({
        name: hostHash.hostname,
        macAddresses: hostHash.mac_addresses,
        selected: true
      });

      if (!this.autoDetectedNodeIsValid(host, usedMacs)) {
        return;
      }

      if (host.get('macAddresses.length') === 1) {
        host.set('value', host.get('macAddresses')[0]);
        autoDetectedNodesSingleMac.pushObject(host);
      } else if (host.get('macAddresses.length') > 1) {
        host.set('value', '');
        autoDetectedNodesMultiMac.pushObject(host);
      }
    });

    this.set('autoDetectedNodesMultiMac', autoDetectedNodesMultiMac);
    this.set('autoDetectedNodesSingleMac', autoDetectedNodesSingleMac);
  },

  autoDetectedNodeIsValid(host, usedMacs) {
    let hostMacs = host.get('macAddresses');

    if (!hostMacs) {
      return false;
    }

    for (let i = 0; i < hostMacs.length; i++) {
      if (usedMacs.contains(hostMacs[i])) {
        return false;
      }
    }

    return true;
  },

  prepAutoDetectNodeInfo() {
    let nodeInfo = this.get('nodeInfo');
    let macAddresses = this.get('autoDetectedNodesMultiMac').filter(node => node.get('selected'));

    this.get('autoDetectedNodesSingleMac').forEach(node => {
      if (node.get('selected')) {
        macAddresses.pushObject(node);
      }
    });

    nodeInfo.set('macAddresses', macAddresses);
    nodeInfo.set('vendor', this.get('selectedVendor'));
  },

  getNodeError(nodeManager, node) {
    if (node.get('ready')) {
      return null;
    }

    let macAddress = node.getMacAddress(this.get('ports'));
    let nodeLabel = macAddress ? `MAC Address ${macAddress}` : node.get('id');

    let foremanTask = node.getForemanTask(this.get('introspectionTasks'), this.get('foremanTasks'));
    let foremanErrors = foremanTask ? foremanTask.get('humanized_errors') : '';

    let lastError = node.get('last_error') || '';

    if (foremanTask && foremanTask.get('state') === 'running') {
      return null;
    }

    if (Ember.isBlank(lastError) && Ember.isBlank(foremanErrors)) {
      return null;
    }

    foremanErrors = this.formatForemanTaskError(foremanErrors);

    return Ember.Object.create({
      taskUrl: foremanTask ? foremanTask.get('taskUrl') : '',
      message: `${nodeLabel} from ${nodeManager.get('address')} ${foremanErrors} ${lastError}`
    });
  },

  getRegistrationError(taskId) {
    let foremanTasks = this.get('foremanTasks');
    let foremanTask = foremanTasks ? foremanTasks.findBy('id', taskId) : null;
    let foremanErrors = foremanTask ? foremanTask.get('humanized_errors') : '';

    if (foremanTask && foremanTask.get('state') === 'running') {
      return null;
    }

    if (Ember.isBlank(foremanErrors)) {
      return null;
    }

    foremanErrors = this.formatForemanTaskError(foremanErrors);

    let introspectionTasks = this.get('introspectionTasks');
    let introspectionTask = introspectionTasks ? introspectionTasks.findBy('task_id', taskId) : null;
    let macAddress = introspectionTask ? introspectionTask.get('mac_address') : '??';

    let node = this.get('nodes').findBy('id', introspectionTask.get('node_uuid')); //we'll already show this under node errors.

    if (node || Ember.isBlank(foremanErrors)) {
      return null;
    }

    return Ember.Object.create({
      taskUrl: foremanTask ? foremanTask.get('taskUrl') : '',
      message: `Introspection task for ${macAddress} error: ${foremanErrors}`
    });
  },

  formatForemanTaskError(errorMessage) {
    let formattedErrorMessage = errorMessage;
    let requestErrorMatches = errorMessage.match(/@body=".*", @headers/i);

    if (Ember.isPresent(requestErrorMatches)) {
      formattedErrorMessage = requestErrorMatches[0].replace('@body="', '').replace('", @headers', '');
    }

    return formattedErrorMessage.substring(0, Math.min(250, errorMessage.length));
  },

  getErrorMessageFromReason(reason) {
    try {
      var displayMessage = reason.responseJSON.displayMessage;

      if (displayMessage.indexOf('{') >= 0 && displayMessage.indexOf('}') >= 1) {
        displayMessage = displayMessage.substring(displayMessage.indexOf('{'),displayMessage.indexOf('}') + 1) + "}";
        displayMessage = displayMessage.replace(/\\/g, "");
        displayMessage = displayMessage.replace(/"\{/g, "{");

        var errorObj = JSON.parse(displayMessage);
        displayMessage = errorObj.error_message.faultstring;
      }

      return displayMessage;
    }
    catch (e) {
      return reason.statusText;
    }
  },

  getPassword(manager) {
    let foundInfo = this.getSavedInfo(manager);
    return foundInfo ? foundInfo.get('password') : null;
  },

  getSavedInfo(manager) {
    return this.get('savedInfo').find((savedInfo) => {
      return savedInfo.get('driver') === manager.get('driver') &&
        savedInfo.get('address') === manager.get('address') &&
        savedInfo.get('username') === manager.get('username');
    });
  },

  getCSVFileInput() {
    return Ember.$('#csvUploadInput')[0];
  },

  updloadCsvFile() {
    var uploadfile = this.getCSVFileInput();
    uploadfile.click();
  },

  parseCsvFile(fileInput) {
    let csvInfo = [];
    let csvErrors = [];
    let controller = this;
    let file = fileInput.files[0];
    let macAddressValidator = MacAddressValidator.create({});
    let usedMacs = this.getPortMacAddresses();


    if (file) {
      let reader = new FileReader();
      reader.onload = function() {
        var text = reader.result;
        var csvArray;

        try {
          csvArray = Ember.$.csv.toArrays(text);
        } catch (e) {
          console.log(e);
          controller.set('csvInfo', []);
          controller.set('csvErrors', [e.message]);
          return;
        }

        csvArray.forEach((row, rowIndex) => {
          if (!Array.isArray(row) || row.length < 5) {
            csvErrors.pushObject(`Row ${rowIndex + 1} Invalid row`);
            return;
          }

          if (row.length < 5) {
            csvErrors.pushObject(`Row ${rowIndex + 1} does not have enough fields (${row.length})`);
            return;
          }

          if (rowIndex === 0 && Ember.isPresent(row[0]) && row[0].toLowerCase().indexOf('driver') >= 0) {
            return;  //skip header row if present
          }

          let csvNode = Ember.Object.create({});
          let errorsFound = false;

          if (row[0].toLowerCase().indexOf('ssh') >= 0) {
            csvNode.set('driver', 'pxe_ssh');
          } else if(row[0].toLowerCase().indexOf('ipmi') >= 0) {
            csvNode.set('driver', 'pxe_ipmitool');
          } else {
            csvErrors.pushObject(`Row ${rowIndex + 1}, Column 1: "${row[0]}" is not a valid driver value`);
            errorsFound = true;
          }

          if (controller.get('hostAddressValidator').isValid(row[1])) {
            csvNode.set('address', row[1]);
          } else {
            csvErrors.pushObject(`Row ${rowIndex + 1}, Column 2: "${row[1]}" is not a valid host address`);
            errorsFound = true;
          }

          if (Ember.isPresent(row[2])) {
            csvNode.set('username', row[2]);
          } else {
            csvErrors.pushObject(`Row ${rowIndex + 1}, Column 3: "${row[2]}" is not a valid username`);
            errorsFound = true;
          }

          if (Ember.isPresent(row[3])) {
            csvNode.set('password', row[3]);
          } else {
            csvErrors.pushObject(`Row ${rowIndex + 1}, Column 4: "${row[3]}" is not a valid password`);
            errorsFound = true;
          }

          if (Ember.isBlank(row[4]) || macAddressValidator.isInvalid(row[4])) {
            csvErrors.pushObject(`Row ${rowIndex + 1}, Column 5 "${row[4]}" is not a valid MAC address`);
            errorsFound = true;
          } else if (usedMacs.contains(row[4].trim())) {
            csvErrors.pushObject(`Row ${rowIndex + 1}, Column 5 "${row[4]}" is not an available MAC address`);
            errorsFound = true;
          } else {
            csvNode.set('macAddresses', [Ember.Object.create({value: row[4]})]);
          }

          if (!errorsFound) {
            csvInfo.pushObject(csvNode);
            usedMacs.push(row[4].trim());
          }
        });

        controller.set('csvInfo', csvInfo);
        controller.set('csvErrors', csvErrors);
      };

      reader.onloadend = function() {
        if (reader.error) {
          console.log(reader.error.message);
          controller.set('csvErrors', [reader.error.message]);
        }
      };

      reader.readAsText(file);
    }
  },

  getPortMacAddresses() {
    return this.get('ports') ? this.get('ports').map(port => port.address) : [];
  },

  handleOutsideClick() {
    //do nothing
  }

});

export default RegisterNodesController;