import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  stepNumberCloudForms: Ember.computed.alias("deploymentController.stepNumberCloudForms"),

  hasInstallLocation: Ember.computed('deploymentController.model.cfme_install_loc', function() {
    return Ember.isPresent(this.get('deploymentController.model.cfme_install_loc'));
  }),
  hasNoInstallLocation: Ember.computed.not("hasInstallLocation"),

  hasCFRootPassword: Ember.computed('deploymentController.model.cfme_root_password', function() {
    return (Ember.isPresent(this.get('deploymentController.model.cfme_root_password')) &&
            (this.get('deploymentController.model.cfme_root_password.length') > 7)
           );
  }),
  hasNoCFRootPassword: Ember.computed.not("hasCFRootPassword"),

  hasCFAdminPassword: Ember.computed('deploymentController.model.cfme_admin_password', function() {
    return (Ember.isPresent(this.get('deploymentController.model.cfme_admin_password')) &&
            (this.get('deploymentController.model.cfme_admin_password.length') > 7)
           );
  }),
  hasNoCFAdminPassword: Ember.computed.not("hasCFAdminPassword"),

  validCloudforms: Ember.computed(
    'hasInstallLocation',
    'hasCFRootPassword',
    'hasCFAdminPassword',
    function() {
      return this.get('hasInstallLocation') && this.get('hasCFRootPassword') && this.get('hasCFAdminPassword');
    }
  ),
  notValidCloudforms: Ember.computed.not("validCloudforms")

});
