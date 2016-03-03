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
          let errorMessage = this.getNodeErrorMessage(manager, node);
          if (errorMessage) {
            nodeErrors.pushObject(errorMessage);
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
    function () {
      let newIntrospectionTaskIds = this.get('newIntrospectionTaskIds') || [];
      let foremanTasks = this.get('foremanTasks') || [];
      let registrationErrors = [];

      newIntrospectionTaskIds.forEach((taskId) => {
        let errorMessage = this.getRegistrationErrorMessage(taskId);
        if (errorMessage) {
          registrationErrors.pushObject(errorMessage);
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

  isValidNewNodeCsv: Ember.computed(function() {
    return false;
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

  disableNewNodesSubmit: Ember.computed('isValidNewNodeAuto', 'isValidNewNodeCsv', 'isValidNewNodeManual', function() {
    return !this.get('isValidNewNodeManual');
  }),

  enableRegisterNodesNext: Ember.computed('nodeCount', function() {
    return this.get('nodeCount') >= 2;
  }),

  disableRegisterNodesNext: Ember.computed.not('enableRegisterNodesNext'),

  actions: {
    showNodeRegistrationModal() {
      this.set('registerNodesMethod', 'manual');

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

    registerNodes() {
      let nodeInfo = this.get('nodeInfo');
      this.set('newIntrospectionTaskIds', []);
      nodeInfo.get('macAddresses').forEach((macAddress) => {
        if (macAddress && Ember.isPresent(macAddress.value)) {
          this.registerNode(nodeInfo, macAddress.value);
        }
      });
      this.closeRegDialog();
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
    let url = `/fusor/api/openstack/deployments/${this.get('deploymentId')}/nodes/${this.get('nodeToDelete.id')}`
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

  registerNode(nodeInfo, macAddress) {
    nodeInfo.set('address', nodeInfo.get('address').trim());
    nodeInfo.set('username', nodeInfo.get('username').trim());

    this.closeRegDialog();
    let nodeParam = this.createNodeHash(nodeInfo, macAddress);
    let url = `/fusor/api/openstack/deployments/${this.get('deploymentId')}/nodes`;

    return request({
      url: url,
      type: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": Ember.$('meta[name="csrf-token"]').attr('content')
      },
      data: JSON.stringify({ node: nodeParam })
    }).then((result) => {
        this.get('newIntrospectionTaskIds').pushObject(result.id);
        this.get('savedInfo').unshiftObject(nodeInfo);
        this.send('refreshModelOnOverviewRoute');
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

  getNodeErrorMessage(nodeManager, node) {
    let macAddress = node.getMacAddress(this.get('ports'));
    let nodeLabel = macAddress ? `MAC Address ${macAddress}` : node.get('id');

    let foremanTask = node.getForemanTask(this.get('introspectionTasks'), this.get('foremanTasks'));
    let foremanErrors = foremanTask ? foremanTask.get('humanized_errors') : '';

    let lastError = node.get('last_error') || '';

    if (Ember.isBlank(lastError) && Ember.isBlank(foremanErrors)) {
      return null;
    }

    foremanErrors = this.formatForemanTaskError(foremanErrors);

    return `${nodeLabel} from ${nodeManager.get('address')} ${foremanErrors} ${lastError}`;
  },

  getRegistrationErrorMessage(taskId) {
    let foremanTasks = this.get('foremanTasks');
    let foremanTask = foremanTasks ? foremanTasks.findBy('id', taskId) : null;
    let foremanErrors = foremanTask ? foremanTask.get('humanized_errors') : '';

    if (Ember.isBlank(foremanErrors)) {
      return null;
    }

    foremanErrors = this.formatForemanTaskError(foremanErrors);

    let introspectionTasks = this.get('introspectionTasks');
    let introspectionTask = introspectionTasks ? introspectionTasks.findBy('task_id', taskId) : null;
    let macAddress = introspectionTask ? introspectionTask.get('mac_address') : '??';

    return Ember.isPresent(foremanErrors) ? `Introspection task for ${macAddress} error: ${foremanErrors}` : null;
  },

  formatForemanTaskError(errorMessage) {
    let requestErrorMatches = errorMessage.match(/@body=".*", @headers/i);

    if (Ember.isPresent(requestErrorMatches)) {
      return requestErrorMatches[0].replace('@body="', '').replace('", @headers', '');
    }

    return errorMessage;
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
    return $('#regNodesUploadFileInput')[0];
  },

  updloadCsvFile() {
    var uploadfile = this.getCSVFileInput();
    uploadfile.click();
  },

  csvFileChosen() {
    var fileInput = this.getCSVFileInput();
    var file = fileInput.files[0];
    var self = this;
    if (file) {
      var reader = new FileReader();
      reader.onload = function() {
        var text = reader.result;
        var data = $.csv.toArrays(text);
        var edittedNodes = self.get('edittedNodes');
        // If the default added node is still listed, remove it
        if (edittedNodes.get('length') === 1 && edittedNodes[0].isDefault && Ember.isEmpty(edittedNodes[0].get('ipAddress'))) {
          edittedNodes.removeObject(edittedNodes[0]);
        }

        for (var row in data) {
          var node_data = data[row];
          if (Array.isArray(node_data) && node_data.length >=5) {
            var driver = node_data[0].trim();
            var ipmi_address = node_data[1].trim();
            var ipmi_username = node_data[2].trim();
            var ipmi_password = node_data[3].trim();
            var mac_address = node_data[4].trim();

            var newNode = self.Node.create({
              driver: driver,
              ipAddress: ipmi_address,
              ipmiUsername: ipmi_username,
              ipmiPassword: ipmi_password,
              nicMacAddress: mac_address
            });
            edittedNodes.insertAt(0, newNode);
            self.updateNodeSelection(newNode);
          }
        }
      };
      reader.onloadend = function() {
        if (reader.error) {
          console.log(reader.error.message);
        }
      };

      reader.readAsText(file);
    }
  }

});
