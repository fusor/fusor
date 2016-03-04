import Ember from 'ember';
import request from 'ic-ajax';
import ProgressBarMixin from "../mixins/progress-bar-mixin";
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";
import OspNodeManager from "../models/osp-node-manager";

import {
  AggregateValidator,
  MacAddressValidator,
  IpAddressValidator,
  PresenceValidator,
  validateZipper
} from  "../utils/validators";

export default Ember.Controller.extend(ProgressBarMixin, NeedsDeploymentMixin, {
  deploymentId: Ember.computed.alias("deploymentController.model.id"),
  openStack: Ember.computed.alias("deploymentController.openStack"),
  deployment: Ember.computed.alias("deploymentController.model"),
  intervalPolling: 10000,

  presenceValidator: PresenceValidator.create({}),
  macAddressValidator: MacAddressValidator.create({}),

  ipAddressValidator: AggregateValidator.create({
    validators: [
      PresenceValidator.create({}),
      IpAddressValidator.create({})
    ]
  }),

  savedInfo: [],
  csvInfo: [],
  csvErrors: [],

  drivers: [
    {label: 'IPMI Driver', value: 'pxe_ipmitool'},
    {label: 'PXE + SSH', value: 'pxe_ssh'}
  ],

  vendors: [
    {label: 'Dell', value: 'dell'}
  ],

  isNewNodeMethodAuto: Ember.computed('registerNodesMethod', function() {
    return this.get('registerNodesMethod') === 'ipmi_auto_detect';
  }),

  isNewNodeMethodCSV: Ember.computed('registerNodesMethod', function() {
    return this.get('registerNodesMethod') === 'csv_upload';
  }),

  isNewNodeMethodManual: Ember.computed('registerNodesMethod', function() {
    return this.get('registerNodesMethod') === 'manual';
  }),

  newNodeManualAddressLabel: Ember.computed('nodeInfo.driver', function () {
    switch (this.get('nodeInfo.driver')) {
      case 'pxe_ssh':
        return 'SSH Address';
      case 'pxe_ipmitool':
        return 'IPMI Address';
      default:
        return 'IP Address';
    }
  }),

  newNodeManualUsernameLabel: Ember.computed('nodeInfo.driver', function () {
    switch (this.get('nodeInfo.driver')) {
      case 'pxe_ssh':
        return 'SSH User';
      case 'pxe_ipmitool':
        return 'IPMI User';
      default:
        return 'Username';
    }
  }),

  newNodeManualPasswordLabel: Ember.computed('nodeInfo.driver', function () {
    switch (this.get('nodeInfo.driver')) {
      case 'pxe_ssh':
        return 'SSH Password';
      case 'pxe_ipmitool':
        return 'IPMI Password';
      default:
        return 'Password';
    }
  }),

  nodeCount: Ember.computed('nodes.@each', function() {
    let nodes = this.get('nodes');
    return nodes ? nodes.reduce((prev, node) => prev + (node.get('isReady') ? 1 : 0), 0) : 0;
  }),

  hasNodes: Ember.computed('nodeCount', function() {
    return this.get('nodeCount') > 0;
  }),

  newNodeSubmitButtonText: Ember.computed('isNewNodeMethodAuto', function() {
    return this.get('isNewNodeMethodAuto') ? 'Detect' : 'Register';
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

  isValidNewNodeAuto: Ember.computed(function() {
    return false;
  }),

  hasCsvInfo: Ember.computed('csvInfo.[]', function() {
    return Ember.isPresent(this.get('csvInfo'));
  }),

  hasCsvErrors: Ember.computed('csvErrors.[]', function() {
    return Ember.isPresent(this.get('csvErrors'));
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
        this.get('ipAddressValidator').isValid(this.get('nodeInfo.address'));

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

  disableNewNodesSubmit: Ember.computed.not('hasValidNodesForRegistration'),

  enableRegisterNodesNext: Ember.computed('nodeCount', function() {
    return this.get('nodeCount') >= 2;
  }),

  disableRegisterNodesNext: Ember.computed.not('enableRegisterNodesNext'),

  actions: {
    showNodeRegistrationModal() {
      this.set('registerNodesMethod', 'manual');
      this.set('csvInfo', []);
      this.set('csvErrors', []);

      this.set('nodeInfo', Ember.Object.create({
        vendor: null,
        driver: null,
        address: null,
        username: null,
        password: null,
        macAddresses: [Ember.Object.create({value: ''})]
      }));

      this.openRegDialog();
    },

    addMacAddress() {
      this.get('nodeInfo.macAddresses').pushObject(Ember.Object.create({value: ''}));
    },

    submitRegisterNodes() {
      let method = this.get('registerNodesMethod');
      this.set('newIntrospectionTaskIds', []);

      if (method === 'manual') {
        let nodeInfo = this.get('nodeInfo');
        this.registerNodes(nodeInfo);
      } else if (method === 'csv_upload') {
        let csvInfo = this.get('csvInfo');
        csvInfo.forEach((nodeInfo) => {
          this.registerNodes(nodeInfo);
        });
      } else if (method === 'ipmi_auto_detect') {

      }

      this.closeRegDialog();
    },

    csvFileChosen() {
      this.parseCsvFile(this.getCSVFileInput());
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

      this.openRegDialog();
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
    },

    cancelRegisterNodes() {
      this.closeRegDialog();
    }
  },

  deleteNodeRequest() {
    let url = `/fusor/api/openstack/deployments/${this.get('deploymentId')}/nodes/${this.get('nodeToDelete.id')}`;
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
      this.send('error', error, `Unable to delete node. DELETE ${url} failed with status code ${error.jqXHR.status}`);
    }).finally((result) => {
      this.set('openDeleteNodeConfirmation', false);
      this.set('closeDeleteNodeConfirmation', true);
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
    this.set('openNewNodeRegistrationModal', true);
    this.set('closeNewNodeRegistrationModal', false);
  },

  closeRegDialog() {
    this.set('openNewNodeRegistrationModal', false);
    this.set('closeNewNodeRegistrationModal', true);
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
      address: macAddress
    };
  },

  getNodeError(nodeManager, node) {
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

          if (rowIndex === 0 && Ember.isPresent(row[0]) && row[0].toLowerCase().includes('driver')) {
            return;  //skip header row if present
          }

          let csvNode = Ember.Object.create({});
          let errorsFound = false;

          if (row[0].toLowerCase().includes('ssh')) {
            csvNode.set('driver', 'pxe_ssh');
          } else if(row[0].toLowerCase().includes('ipmi')) {
            csvNode.set('driver', 'pxe_ipmitool');
          } else {
            csvErrors.pushObject(`Row ${rowIndex + 1}, Column 1: "${row[0]}" is not a valid driver value`);
            errorsFound = true;
          }

          if (controller.get('ipAddressValidator').isValid(row[1])) {
            csvNode.set('address', row[1]);
          } else {
            csvErrors.pushObject(`Row ${rowIndex + 1}, Column 2: "${row[1]}" is not a valid IP Address`);
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

          if (Ember.isPresent(row[4]) && controller.get('macAddressValidator')) {
            csvNode.set('macAddresses', [Ember.Object.create({value: row[4]})]);
          } else {
            csvErrors.pushObject(`Row ${rowIndex + 1}, Column 5 "${row[4]}" is not a valid MAC address`);
            errorsFound = true;
          }

          if (!errorsFound) {
            csvInfo.pushObject(csvNode);
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

  handleOutsideClick() {
    //do nothing
  }

});
