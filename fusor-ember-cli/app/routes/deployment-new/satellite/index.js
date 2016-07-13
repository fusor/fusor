import Ember from 'ember';
import DeploymentNewSatelliteRouteMixin from "../../../mixins/deployment-new-satellite-route-mixin";

export default Ember.Route.extend(DeploymentNewSatelliteRouteMixin, {

  setupController(controller, model) {
    controller.set('model', model);
    // reset common password fields
    controller.set('commonPassword', null);
    controller.set('confirmCommonPassword', null);
    this.store.findRecord('organization', 1).then(function(result) {
      model.set('organization', result);
    });
  },

  deactivate() {
    let deploymentName = this.get('controller.model.name');
    if (Ember.isPresent(deploymentName)) {
      this.set('controller.model.name', deploymentName.trim());
    }
    this.prePopulatePasswords();
  },

  prePopulatePasswords() {
    let commonPassword = this.get('controller.commonPassword');
    let deploymentNewController = this.controllerFor('deployment-new');
    let deployment = deploymentNewController.get('model');
    let isValidDeployment =  deployment && !deployment.get('isDeleted');
    let isValidCommonPassword = commonPassword && deploymentNewController.get('isValidCommonPassword');

    if (isValidDeployment && isValidCommonPassword) {
      deployment.set('rhev_engine_admin_password', commonPassword);
      deployment.set('rhev_root_password', commonPassword);
      deployment.set('cfme_root_password', commonPassword);
      deployment.set('cfme_admin_password', commonPassword);
      deployment.set('cfme_db_password', commonPassword);
      deployment.set('openshift_user_password', commonPassword);
      deployment.set('openshift_root_password', commonPassword);

      // confirmation fields on the deployment controller, not the model
      deploymentNewController.set('confirmRhevRootPassword', commonPassword);
      deploymentNewController.set('confirmRhevEngineAdminPassword', commonPassword);
      deploymentNewController.set('confirmCfmeRootPassword', commonPassword);
      deploymentNewController.set('confirmCfmeAdminPassword', commonPassword);
      deploymentNewController.set('confirmCfmeDbPassword', commonPassword);
    }
  }

});
