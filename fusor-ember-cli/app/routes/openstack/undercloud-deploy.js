import Ember from 'ember';
import request from 'ic-ajax';
import PollingPromise from '../../mixins/polling-promise-mixin';

export default Ember.Route.extend(PollingPromise, {
  setupController(controller, model) {
    controller.set('model', model);
    this.displayStackStatus().catch(error => {
      console.log(error);
      this.set('controller.errorMsg', `Error trying to retrieve stacks from undercloud.  ${error.jqXHR.status}: ${error.jqXHR.statusText}`);
      this.set('controller.showLoadingSpinner', false);
    });
  },

  deactivate() {
    return this.send('saveOpenstackDeployment', null);
  },

  actions: {
    deployUndercloud() {
      this.deployUndercloudRequest()
        .then(() => this.displayDeployUndercloudStatus())
        .then(() => this.refreshDeployedUndercloudModel())
        .catch(error =>  this.displayDeploymentError(error))
        .finally(() => this.set('controller.showLoadingSpinner', false));
    },

    deleteStack() {
      this.deleteStackRequest()
        .then(() => this.displayStackStatus())
        .catch(error => {
          this.displayDeleteError(error);
          this.set('controller.showLoadingSpinner', false);
        });
    }
  },

  displayStackStatus() {
    let deployment = this.modelFor('deployment');
    let openstackDeployment = this.get('controller.openstackDeployment');

    if (deployment.get('isStarted') || !openstackDeployment.get('isUndercloudConnected')) {
      return Ember.RSVP.Promise.resolve(null);
    }

    this.set('controller.errorMsg', null);
    this.set('controller.loadingSpinnerText', 'Inspecting Undercloud...');
    this.set('controller.showLoadingSpinner', true);

    return this.getUndercloudStacks().then(() => {
      let stack = this.get('controller.stack');
      let stackIsDeleting = this.get('controller.stack.stack_status') === 'DELETE_IN_PROGRESS';

      if (stackIsDeleting) {
        this.set('controller.showLoadingSpinner', true);
        this.set('controller.loadingSpinnerText', `Deleting stack ${stack.get('stack_name')}...`);
        this.startPolling('pollForDeletedStackStatus');
      } else {
        this.set('controller.showLoadingSpinner', false);
      }
    });
  },

  deployUndercloudRequest() {
    let deploymentId = this.get('controller.deploymentId');
    let openstackDeployment = this.get('controller.openstackDeployment');
    this.set('controller.deploymentError', null);

    this.set('controller.errorMsg', null);
    this.set('controller.loadingSpinnerText', `Deploying undercloud...`);
    this.set('controller.showLoadingSpinner', true);

    return request({
      url: `/fusor/api/openstack/deployments/${deploymentId}/underclouds`,
      type: 'POST',
      data: JSON.stringify({
        'underhost': openstackDeployment.get('undercloud_ip_address'),
        'underuser': openstackDeployment.get('undercloud_ssh_username'),
        'underpass': openstackDeployment.get('undercloud_ssh_password'),
        'deployment_id': deploymentId
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': Ember.$('meta[name="csrf-token"]').attr('content')
      }
    }).then(response => {
      if (this.get('controller.applicationController.isEmberCliMode')) {
        // only used for development to enabled OSP tabs (disableOspTab: false)
        openstackDeployment.set('openstack_undercloud_password', 'this-passwd-is-populated by fusor/server');
        this.send('saveOpenstackDeployment', null);
      }
    });
  },

  displayDeployUndercloudStatus() {
    let deploymentId = this.get('controller.deploymentId');

    this.set('controller.errorMsg', null);
    this.set('controller.loadingSpinnerText', `Checking deployment status ...`);
    this.set('controller.showLoadingSpinner', true);
    this.set('controller.deploymentError', null);

    return new Ember.RSVP.Promise((resolve, reject) => {
      request({
        url: `/fusor/api/openstack/deployments/${deploymentId}/underclouds/${deploymentId}`,
        type: 'GET',
        contentType: 'application/json'
      }).then(response => {
        if (response.deployed) {
          resolve(null);
        } else {
          reject('There was an issue deploying the undercloud.  Please check foreman logs.');
        }
        this.set('controller.showLoadingSpinner', false);
      });
    });
  },

  refreshDeployedUndercloudModel() {
    // this.refresh();
    // Refresh doesn't work.  Manually reloading the openstack-deployment object.
    let openstackDeploymentId = this.get('controller.openstackDeployment.id');
    this.set('controller.showLoadingSpinner', true);

    return this.store.findRecord('openstack-deployment', openstackDeploymentId, {reload: true})
      .then(ospd => this.set('controller.openstackDeployment', ospd))
      .then(() => this.displayStackStatus());
  },

  getUndercloudStacks() {
    let deploymentId = this.modelFor('deployment').get('id');
    let openstackDeployment = this.get('controller.openstackDeployment');

    return request({
      url: `/fusor/api/openstack/deployments/${deploymentId}/stacks`,
      type: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': Ember.$('meta[name="csrf-token"]').attr('content')
      }
    }).then(response => {
      let stack = response.stacks[0] ? Ember.Object.create(response.stacks[0]) : null;
      this.set('controller.stack', stack);
      openstackDeployment.set('overcloud_deployed', Ember.isPresent(stack));
    });
  },

  pollForDeletedStackStatus() {
    return this.getUndercloudStacks().then((() => {
      let stackIsDeleting = this.get('controller.stack.stack_status') === 'DELETE_IN_PROGRESS';
      if (!stackIsDeleting) {
        this.stopPolling('pollForDeletedStackStatus');
        this.set('controller.showLoadingSpinner', false);
      }
    }));
  },

  deleteStackRequest() {
    let deploymentId = this.modelFor('deployment').get('id');
    let controller = this.get('controller');
    let stackName = this.get('controller.stack.stack_name');
    let openstackDeployment = controller.get('openstackDeployment');

    controller.set('errorMsg', null);
    controller.set('loadingSpinnerText', `Deleting stack ${stackName}...`);
    controller.set('showLoadingSpinner', true);

    return request({
      url: `/fusor/api/openstack/deployments/${deploymentId}/stacks/${stackName}`,
      type: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': Ember.$('meta[name="csrf-token"]').attr('content')
      }
    });
  },

  displayDeploymentError(error) {
    console.log(error);
    if (Ember.typeOf(error) === 'string') {
      this.set('controller.deploymentError', error);
    } else if (Ember.typeOf(error) === 'object' && error.jqXHR && error.jqXHR.responseJSON) {
      this.set('controller.deploymentError', error.jqXHR.responseJSON.errors);
    } else {
      this.set('controller.deploymentError', JSON.stringify(error));
    }
  },

  displayDeleteError(error) {
    console.log(error);
    this.set('controller.errorMsg', `Error trying to delete stack from undercloud.  ${error.jqXHR.status}: ${error.jqXHR.statusText}`);
  }
});
