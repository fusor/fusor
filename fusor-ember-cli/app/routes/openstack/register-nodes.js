import Ember from 'ember';
import request from 'ic-ajax';
import OspNodeManager from "../../utils/osp/osp-node-manager";

export default Ember.Route.extend({

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('nodeManagers', []);
    controller.set('introspectionTasks', []);

    var deploymentId = this.modelFor('deployment').get('id');
    this.store.query('image', {deployment_id: deploymentId}).then(function(results) {
      let bmDeployKernelImage = results.findBy('name', 'bm-deploy-kernel');
      let bmDeployRamdiskImage = results.findBy('name', 'bm-deploy-ramdisk');
      controller.set('bmDeployKernelImage', bmDeployKernelImage);
      controller.set('bmDeployRamdiskImage', bmDeployRamdiskImage);
    });

    controller.set('showSpinner', true);
    this.loadAll().then(() => controller.set('showSpinner', false));
    controller.stopPolling();
    controller.startPolling();
  },

  deactivate() {
    this.get('controller').stopPolling();
    this.send('saveOpenstackDeployment');
  },

  actions: {
    deleteNode(node) {
      this.set('deleteNode', node);
      this.set('openDeleteNodeConfirmation', true);
      this.set('closeDeleteNodeConfirmation', false);
    },

    refreshModelOnOverviewRoute() {
      this.loadAll();
    },

    error(error, message) {
      console.log(error, message);
      this.set('controller.errorMsg', this.formatError(error, message));
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
    });
  },

  loadNodes() {
    let controller = this.get('controller');
    return this.store.query('node', {deployment_id: controller.get('deploymentId')}).then(
      (result) => {
        controller.set('nodes', result);
      },
      (error) => {
        this.send('error', error, 'Error retrieving OpenStack nodes.');
      });
  },

  loadPorts() {
    let controller = this.get('controller');
    let deploymentId = this.get('controller.deploymentId');
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
    }).then((result) => {
      controller.set('ports', result.ports);
    }, (error) => {
      this.send('error', error, `Unable to load node ports. GET "${url}" failed with status code ${error.jqXHR.status}.`);
    });
  },

  loadIntrospectionTasks() {
    let controller = this.get('controller');
    let deploymentId = this.get('controller.deploymentId');
    return this.store.findRecord('deployment', deploymentId, {reload: true}).then(
      (deployment) => {
        controller.set('introspectionTasks', deployment.get('introspection_tasks'));
      },
      (error) => {
        this.send('error', error, 'ERROR retrieving deployment introspection tasks.');
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
    let newIntrospectionTaskIds = this.get('controller.newIntrospectionTaskIds') || [];
    let nodes = this.get('controller.nodes') || [];

    introspectionTasks.forEach((introspectionTask) => {
      let foremanTaskId = introspectionTask.get('task_id');

      let node = nodes.findBy('id', introspectionTask.get('node_uuid'));
      let nodeNotReady = node && !node.get('ready');

      let isNewIntrospectionTask = !!newIntrospectionTaskIds.contains(introspectionTask.get('task_id'));

      if (foremanTaskId && (nodeNotReady || isNewIntrospectionTask)) {
        taskPromises.push(this.store.findRecord('foreman-task', foremanTaskId, {reload: true}));
      }
    });

    return Ember.RSVP.all(taskPromises).then((resolvedTasks) => {
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
    }

    return message ? message + ' ' + errorMessage : errorMessage;
  }
});
