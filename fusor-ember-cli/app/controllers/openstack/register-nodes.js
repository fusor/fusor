import Ember from 'ember';
import request from 'ic-ajax';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

const RegisterNodesController = Ember.Controller.extend(NeedsDeploymentMixin, {
  deployment: Ember.computed.alias("deploymentController.model"),
  openstackDeployment: Ember.computed.alias("model"),
  savedInfo: [],
  introspectionTasks: [],
  newIntrospectionTaskIds: [],

  hasNodes: Ember.computed('openstackDeployment.overcloud_node_count', function() {
    return this.get('openstackDeployment.overcloud_node_count') > 0;
  }),

  nodeErrors: Ember.computed(
    'nodeManagers.[]',
    'nodes.[]',
    'introspectionTasks.[]',
    'foremanTasks.@each.humanized_errors',
    'ports.[]',
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
    'newIntrospectionTaskIds.[]',
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

  enableRegisterNodesNext: Ember.computed('openstackDeployment.areNodesRegistered', function() {
    return this.get('openstackDeployment.areNodesRegistered');
  }),

  disableRegisterNodesNext: Ember.computed.not('enableRegisterNodesNext'),

  actions: {
    showNodeRegistrationModal() {
      this.set('openModalNewNode', true);
    },

    submitRegisterNodes(nodeInfo) {
      this.registerNodes(nodeInfo);
    },

    addNodesToManager(nodeManager) {
      this.set('registerNodesMethod', 'manual');

      this.set('addNodeInfo', Ember.Object.create({
        vendor:null,
        driver: nodeManager.get('driver'),
        address: nodeManager.get('address'),
        username: nodeManager.get('username'),
        password: this.getPassword(nodeManager),
        macAddresses: [Ember.Object.create({value: ''})]
      }));

      this.set('openModalAddNode', true);
    },

    submitAddNodes(nodeInfo) {
      this.registerNodes(nodeInfo);
    },

    deleteNode(node, nodeLabel) {
      this.set('nodeToDelete', node);
      this.set('nodeToDeleteLabel', nodeLabel);
      this.set('openModalDeleteNode', true);
    },

    confirmDeleteNode() {
      this.deleteNodeRequest();
    }
  },

  deleteNodeRequest() {
    let url = `/fusor/api/openstack/deployments/${this.get('deployment.id')}/nodes/${this.get('nodeToDelete.id')}`;

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
    let url = `/fusor/api/openstack/deployments/${this.get('deployment.id')}/nodes`;

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
      this.send('restartPolling');
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
  }
});

export default RegisterNodesController;
