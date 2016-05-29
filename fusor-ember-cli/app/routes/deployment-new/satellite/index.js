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
    // pre-populate passwords
    let commonPassword = this.get('controller.commonPassword');
    let deploymentNewController = this.controllerFor('deployment-new');
    if (commonPassword && deploymentNewController.get('isValidCommonPassword')) {
      deploymentNewController.set('model.rhev_engine_admin_password', commonPassword);
      deploymentNewController.set('model.rhev_root_password', commonPassword);
      deploymentNewController.set('model.cfme_root_password', commonPassword);
      deploymentNewController.set('model.cfme_admin_password', commonPassword);
      deploymentNewController.set('model.cfme_db_password', commonPassword);
      deploymentNewController.set('model.openshift_user_password', commonPassword);
      deploymentNewController.set('model.openshift_root_password', commonPassword);

      // confirmation fields on the deployment controller, not the model
      deploymentNewController.set('confirmRhevRootPassword', commonPassword);
      deploymentNewController.set('confirmRhevEngineAdminPassword', commonPassword);
      deploymentNewController.set('confirmCfmeRootPassword', commonPassword);
      deploymentNewController.set('confirmCfmeAdminPassword', commonPassword);
      deploymentNewController.set('confirmCfmeDbPassword', commonPassword);

      deploymentNewController.get('model.openstack_deployment').then(function(result) {
        if (Ember.isPresent(result)) {
          result.set('undercloud_admin_password', commonPassword);
          result.set('undercloud_ssh_password', commonPassword);
          result.set('overcloud_password', commonPassword);
          // confirmation fields on the deployment controller, not the openstack_deployment model
          deploymentNewController.set('confirmOvercloudPassword', result.get('overcloud_password'));
        }
      });
    }
  }

});
