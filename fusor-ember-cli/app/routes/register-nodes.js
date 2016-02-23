import Ember from 'ember';
import request from 'ic-ajax';
import OspNodeManager from "../models/osp-node-manager";

export default Ember.Route.extend({

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('nodeManagers', []);
    controller.set('introspectionTasks', []);
    //controller.set('showAlertMessage', false);

    var deploymentId = this.modelFor('deployment').get('id');
    this.store.query('image', {deployment_id: deploymentId}).then(function(results) {
      var bmDeployKernelImage = results.findBy('name', 'bm-deploy-kernel');
      var bmDeployRamdiskImage = results.findBy('name', 'bm-deploy-ramdisk');
      controller.set('bmDeployKernelImage', bmDeployKernelImage);
      controller.set('bmDeployRamdiskImage', bmDeployRamdiskImage);
    });

    controller.set('showSpinner', true);
    this.loadAll().then(() => controller.set('showSpinner', false));
    controller.stopPolling();
    controller.startPolling();
  },

  deactivate() {
    return this.get('controller').stopPolling();
  },

  actions: {
    deleteNode(node) {
      this.set('deleteNode', node);
      this.set('openDeleteNodeConfirmation', true);
      this.set('closeDeleteNodeConfirmation', false);
    },

    refreshModelOnOverviewRoute() {
      this.loadAll();
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
        console.log('Error retrieving OpenStack nodes', error);
        return this.send('error', error);
      });
  },

  loadPorts() {
    let controller = this.get('controller');
    let deploymentId = this.get('controller.deploymentId');
    let token = Ember.$('meta[name="csrf-token"]').attr('content');

    return request({
      url: `/fusor/api/openstack/deployments/${deploymentId}/node_ports`,
      type: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": token
      },
      data: {}
    }).then(
      (result) => {
        controller.set('ports', result.ports);
      },
      (error) => {
        error = error.jqXHR;
        console.log('ERROR retrieving OpenStack port list', error);
        return this.send('error', error);
      });
  },

  loadIntrospectionTasks() {
    let controller = this.get('controller');
    let deploymentId = this.get('controller.deploymentId');
    this.store.findRecord('deployment', deploymentId, {reload: true}).then(
      (deployment) => {
        controller.set('introspectionTasks', deployment.get('introspection_tasks'));
      },
      (error) => {
        error = error.jqXHR;
        console.log('ERROR retrieving deployment introspection tasks', error);
        return this.send('error', error);
      });
  },

  organizeNodes() {
    let nodes = this.get('controller.nodes');
    let nodeManagers = this.get('controller.nodeManagers');

    if (!nodes) {
      return;
    }

    nodes.forEach((node) => {
      let manager = nodeManagers.find(mgr => mgr.driverMatchesNode(node));

      if (!manager) {
        manager = OspNodeManager.create({});
        manager.setDriverInfoFromNode(node);
        nodeManagers.unshiftObject(manager);
      }

      manager.putNode(node);
    });
  },

  loadForemanTasks() {
    let taskPromises = [];
    let introspectionTasks = this.get('controller.introspectionTasks') || [];
    let nodes = this.get('controller.nodes') || [];

    introspectionTasks.forEach((isTask) => {
      let foremanTaskId = isTask.get('task_id');
      let node = nodes.findBy('id', isTask.get('node_uuid'));

      if (foremanTaskId && node && !node.get('ready')) {
        taskPromises.push(this.store.findRecord('foreman-task', foremanTaskId, {reload: true}));
      }
    });

    return Ember.RSVP.all(taskPromises).then((resolvedTasks) => {
      this.get('controller').set('foremanTasks', resolvedTasks);
    });
  }

});
