import Ember from 'ember';
import request from 'ic-ajax';
import PollingPromise from '../../mixins/polling-promise-mixin';

export default Ember.Route.extend(PollingPromise, {
  setupController(controller, model) {
    controller.set('model', model);
    this.loadUndercloudStatus();
  },

  deactivate() {
    return this.send('saveOpenstackDeployment', null);
  },

  actions: {
    deployUndercloud() {
      this.deployUndercloudRequest()
        .then(() => this.refreshOpenstackDeploymentModel())
        .then(() => this.getUndercloud())
        .then(() => this.displayDeployUndercloudStatus())
        .then(() => this.getUndercloudStacks())
        .then(() => this.displayUndercloudStatus())
        .catch(error => {
          if (error.jqXHR && error.jqXHR.status === 401) {
            this.send('userTimeout');
          } else {
            this.displayDeploymentError(error);
          }
        })
        .finally(() => this.set('controller.showLoadingSpinner', false));
    },

    deleteStack() {
      this.deleteStackRequest()
        .then(() => this.getUndercloudStacks())
        .then(() => this.displayUndercloudStatus())
        .catch(error =>  this.displayRequestError(error, 'Error trying to delete stack from undercloud.'));
    },

    updateDns() {
      this.updateDnsRequest()
        .then(() => this.displayUndercloudStatus())
        .catch(error =>  this.displayRequestError(error, 'Error trying to update the DNS address.'));
    }
  },

  displayRequestError(error, message) {
    console.log(error);
    this.set('controller.errorMsg', `${message} ${error.jqXHR.status}: ${error.jqXHR.statusText}`);
    this.set('controller.showLoadingSpinner', false);
  },

  loadUndercloudStatus() {
    this.set('controller.errorMsg', null);
    this.set('controller.loadingSpinnerText', 'Inspecting Undercloud...');
    this.set('controller.showLoadingSpinner', true);

    this.getUndercloud()
      .then(() => this.getUndercloudStacks())
      .then(() => this.displayUndercloudStatus())
      .catch(error =>  this.displayRequestError(error, 'Error trying to retrieve information from undercloud.'));
  },

  getUndercloud() {
    let deployment = this.modelFor('deployment');
    let deploymentId = deployment.get('id');
    let openstackDeployment = this.get('controller.openstackDeployment');

    if (deployment.get('isStarted') || !openstackDeployment.get('isUndercloudConnected')) {
      this.set('controller.undercloud', null);
      return Ember.RSVP.Promise.resolve(null);
    }

    return request({
      url: `/fusor/api/openstack/deployments/${deploymentId}/undercloud`,
      type: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': Ember.$('meta[name="csrf-token"]').attr('content')
      }
    }).then(response => {
      this.set('controller.undercloud', Ember.Object.create(response));
      return response;
    });
  },

  getUndercloudStacks() {
    let deployment = this.modelFor('deployment');
    let deploymentId = deployment.get('id');
    let openstackDeployment = this.get('controller.openstackDeployment');

    if (deployment.get('isStarted') || !openstackDeployment.get('isUndercloudConnected')) {
      this.set('controller.stack', null);
      return Ember.RSVP.Promise.resolve(null);
    }

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
      return response;
    });
  },

  displayUndercloudStatus() {
    let undercloud = this.get('controller.undercloud');
    let stack = this.get('controller.stack');
    let stackIsDeleting = this.get('controller.stack.stack_status') === 'DELETE_IN_PROGRESS';

    if (stackIsDeleting) {
      this.set('controller.showLoadingSpinner', true);
      this.set('controller.loadingSpinnerText', `Deleting stack ${stack.get('stack_name')}...`);
      this.startPolling('pollForDeletedStackStatus');
    } else {
      this.set('controller.showLoadingSpinner', false);
    }
  },

  deployUndercloudRequest() {
    let deploymentId = this.get('controller.deploymentId');
    let openstackDeployment = this.get('controller.openstackDeployment');
    this.set('controller.deploymentError', null);

    this.set('controller.errorMsg', null);
    this.set('controller.loadingSpinnerText', `Deploying undercloud...`);
    this.set('controller.showLoadingSpinner', true);

    return request({
      url: `/fusor/api/openstack/deployments/${deploymentId}/undercloud`,
      type: 'POST',
      data: JSON.stringify({
        'undercloud_host': openstackDeployment.get('undercloud_ip_address'),
        'undercloud_user': openstackDeployment.get('undercloud_ssh_username'),
        'undercloud_password': openstackDeployment.get('undercloud_ssh_password'),
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
        openstackDeployment.set('undercloud_admin_password', 'this-passwd-is-populated by fusor/server');
        this.send('saveOpenstackDeployment', null);
      }
    });
  },

  displayDeployUndercloudStatus() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (this.get('controller.undercloud.deployed')) {
        resolve(null);
      } else {
        reject('There was an issue deploying the undercloud.  Please check foreman logs.');
      }
    });
  },

  refreshOpenstackDeploymentModel() {
    // this.refresh();
    // Refresh doesn't work.  Manually reloading the openstack-deployment object.
    let openstackDeploymentId = this.get('controller.openstackDeployment.id');
    this.set('controller.showLoadingSpinner', true);

    return this.store.findRecord('openstack-deployment', openstackDeploymentId, {reload: true})
      .then(ospd => this.set('controller.openstackDeployment', ospd));
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

  updateDnsRequest() {
    let deploymentId = this.modelFor('deployment').get('id');
    let controller = this.get('controller');
    let openstackDeployment = controller.get('openstackDeployment');

    controller.set('errorMsg', null);
    controller.set('loadingSpinnerText', 'Updating DNS...');
    controller.set('showLoadingSpinner', true);

    return request({
      url: `/fusor/api/openstack/deployments/${deploymentId}/undercloud/update_dns`,
      type: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': Ember.$('meta[name="csrf-token"]').attr('content')
      }
    }).then(response => {
      this.set('controller.undercloud', Ember.Object.create(response));
      return response;
    });
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
    } else if (Ember.typeOf(error) === 'object' && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.errors) {
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
