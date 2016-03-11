import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  cfmeConfigurationController: Ember.inject.controller('cloudforms.cfme-configuration'),

  stepNumberCloudForms: Ember.computed.alias("deploymentController.stepNumberCloudForms"),
  isValidCfmeConfiguration: Ember.computed.alias("cfmeConfigurationController.isValidCfmeConfiguration"),

  isValidCfmeInstallLocation: Ember.computed.notEmpty('deploymentController.model.cfme_install_loc'),

  isInvalidCfmeInstallLocation: Ember.computed.not("isValidCfmeInstallLocation"),
  disableTabCFConfiguration: Ember.computed.alias("isInvalidCfmeInstallLocation"),

  validCloudforms: Ember.computed('isValidCfmeInstallLocation', 'isValidCfmeConfiguration', function() {
      return this.get('isValidCfmeInstallLocation') && this.get('isValidCfmeConfiguration');
  }),

  notValidCloudforms: Ember.computed.not("validCloudforms")

});
