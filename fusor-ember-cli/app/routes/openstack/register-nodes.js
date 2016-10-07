import Ember from 'ember';
import request from 'ic-ajax';
import PollingPromise from '../../mixins/polling-promise-mixin';
import OspNodeManager from "../../utils/osp/osp-node-manager";

export default Ember.Route.extend(PollingPromise, {
  loadAllInterval: 10000,

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('nodeManagers', []);
    controller.set('introspectionTasks', []);
    controller.set('errorMsg', null);

    var deploymentId = this.modelFor('deployment').get('id');
    this.store.query('image', {deployment_id: deploymentId}).then(function(results) {
      let bmDeployKernelImage = results.findBy('name', 'bm-deploy-kernel');
      let bmDeployRamdiskImage = results.findBy('name', 'bm-deploy-ramdisk');
      controller.set('bmDeployKernelImage', bmDeployKernelImage);
      controller.set('bmDeployRamdiskImage', bmDeployRamdiskImage);
    });

    controller.set('showSpinner', true);
    this.loadAll().then(() => controller.set('showSpinner', false));
    this.stopPolling('loadAll');
    this.startPolling('loadAll');
  },

  deactivate() {
    this.stopPolling('loadAll');
    this.send('saveOpenstackDeployment');
  },

  actions: {
    deleteNode(node) {
      this.set('deleteNode', node);
      this.set('openDeleteNodeConfirmation', true);
      this.set('closeDeleteNodeConfirmation', false);
    },

    restartPolling() {
      this.stopPolling('loadAll');
      this.loadAll().then(() => {
        this.startPolling('loadAll');
      });
    },

    error(error, message) {
      console.log(error, message);
      this.set('controller.errorMsg', this.formatError(error, message));
    },

    resetError() {
      this.set('controller.errorMsg', null);
    },

    loadError(error, message) {
      console.log(error, message);
      this.set('controller.loadErrorMsg', this.formatError(error, message));
    },

    resetLoadError() {
      this.set('controller.loadErrorMsg', null);
    }
  },

  loadAll() {
    return Ember.RSVP.Promise.all([
      this.loadNodes(),
      this.loadPorts(),
      this.loadIntrospectionTasks()
    ]).then(() => {
      this.organizeNodes();
      this.loadForemanTasks();
    }).then(() => {
      this.send('resetLoadError');
    }).catch(error => {
      this.send('loadError', error, 'Error retrieving OpenStack node data.');
    });
  },

  loadNodes() {
    let controller = this.get('controller');
    return this.store.query('node', {deployment_id: controller.get('deployment.id')}).then(result => {
      controller.set('nodes', result);
    });
  },

  loadPorts() {
    let controller = this.get('controller');
    let deploymentId = this.get('controller.deployment.id');
    let token = Ember.$('meta[name="csrf-token"]').attr('content');
    let url = `/fusor/api/openstack/deployments/${deploymentId}/node_ports`;

    return request({
      url: url,
      type: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": token
      },
      data: {}
    }).then(result => {
      controller.set('ports', result.ports);
    });
  },

  loadIntrospectionTasks() {
    let controller = this.get('controller');
    let deploymentId = this.get('controller.deployment.id');
    return this.store.findRecord('deployment', deploymentId, {reload: true}).then(deployment => {
      controller.set('introspectionTasks', deployment.get('introspection_tasks'));
    });
  },

  organizeNodes() {
    let nodes = this.get('controller.nodes');
    let nodeManagers = this.get('controller.nodeManagers');
    let processedNodeIds = {};
    let nodeCount = 0;

    if (!nodes) {
      return;
    }

    nodes.forEach((node) => {
      processedNodeIds[node.get('id')] = true;

      if (node.get('ready')) {
        nodeCount++;
      }

      let manager = nodeManagers.find(mgr => mgr.driverMatchesNode(node));

      if (!manager) {
        manager = OspNodeManager.create({});
        manager.setDriverInfoFromNode(node);
        nodeManagers.unshiftObject(manager);
      }

      manager.putNode(node);
    });

    nodeManagers.forEach((manager) => {
      let notDeleted = manager.get('nodes').filter(node => processedNodeIds[node.get('id')]);
      manager.set('nodes', notDeleted);
    });

    this.set('controller.openstackDeployment.overcloud_node_count', nodeCount);
  },

  loadForemanTasks() {
    let taskPromises = [];
    let introspectionTasks = this.get('controller.introspectionTasks') || [];
    let nodes = this.get('controller.nodes') || [];

    introspectionTasks.forEach((introspectionTask) => {
      let foremanTaskId = introspectionTask.get('task_id');

      let node = nodes.findBy('id', introspectionTask.get('node_uuid'));
      let nodeNotReady = node && !node.get('ready');

      if (foremanTaskId && nodeNotReady) {
        taskPromises.push(this.store.findRecord('foreman-task', foremanTaskId, {reload: true}));
      }
    });

    return Ember.RSVP.all(taskPromises).then(resolvedTasks => {
      this.get('controller').set('foremanTasks', resolvedTasks);
    });
  },

  formatError(error, message) {
    let errorMessage = '';
    switch (Ember.typeOf(error)) {
    case 'string':
      errorMessage = error;
      break;
    case 'error':
      errorMessage = error.message + ': ';
      if (error.errors) {
        error.errors.forEach((subError) => {
          if (subError.title){
            errorMessage += subError.title;
          }
          if (subError.status){
            errorMessage += `  Status: ${subError.status}`;
          }
        });
      }
      break;
    case 'object':
      if (error.jqXHR) {
        let status = error.jqXHR.status;
        let statusText = error.jqXHR.statusText;
        let msg = error.jqXHR.responseJSON ? error.jqXHR.responseJSON.displayMessage : '';
        errorMessage = `${status} ${statusText}: ${msg}`;
      }
    }

    return message ? message + ' ' + errorMessage : errorMessage;
  }
});
