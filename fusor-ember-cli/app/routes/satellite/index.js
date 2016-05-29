import Ember from 'ember';

export default Ember.Route.extend({

  setupController(controller, model) {
    controller.set('model', model);
    // reset common password fields
    controller.set('commonPassword', null);
    controller.set('confirmCommonPassword', null);
  },

  deactivate() {
    let deploymentName = this.get('controller.model.name');
    if (Ember.isPresent(deploymentName)) {
      this.set('controller.model.name', deploymentName.trim());
    }
    // pre-populate passwords
    let commonPassword = this.get('controller.commonPassword');
    let deployment = this.modelFor('deployment');
    let deploymentController = this.controllerFor('deployment');
    if (commonPassword && deploymentController.get('isValidCommonPassword')) {
      deployment.set('rhev_engine_admin_password', commonPassword);
      deployment.set('rhev_root_password', commonPassword);
      deployment.set('cfme_root_password', commonPassword);
      deployment.set('cfme_admin_password', commonPassword);
      deployment.set('cfme_db_password', commonPassword);
      deployment.set('openshift_user_password', commonPassword);
      deployment.set('openshift_root_password', commonPassword);

      // confirmation fields on the deployment controller, not the model
      deploymentController.set('confirmRhevRootPassword', commonPassword);
      deploymentController.set('confirmRhevEngineAdminPassword', commonPassword);
      deploymentController.set('confirmCfmeRootPassword', commonPassword);
      deploymentController.set('confirmCfmeAdminPassword', commonPassword);
      deploymentController.set('confirmCfmeDbPassword', commonPassword);

      deployment.get('openstack_deployment').then(function(result) {
        if (Ember.isPresent(result)) {
          result.set('undercloud_admin_password', commonPassword);
          result.set('undercloud_ssh_password', commonPassword);
          result.set('overcloud_password', commonPassword);
          // confirmation fields on the deployment controller, not the openstack_deployment model
          deploymentController.set('confirmOvercloudPassword', result.get('overcloud_password'));
        }
      });
    }
    return this.send('saveDeployment', null);
  },

  actions: {
    willTransition() {
      return this.controllerFor('deployment').set('isBackToDeployments', false);
    }
  }

});
