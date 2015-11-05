import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  stepNumberCloudForms: Ember.computed.alias("controllers.deployment.stepNumberCloudForms"),

  hasInstallLocation: function() {
    return Ember.isPresent(this.get('controllers.deployment.model.cfme_install_loc'));
  }.property('controllers.deployment.model.cfme_install_loc'),
  hasNoInstallLocation: Ember.computed.not("hasInstallLocation"),

  hasCFRootPassword: function() {
    return (Ember.isPresent(this.get('controllers.deployment.model.cfme_root_password')) &&
            (this.get('controllers.deployment.model.cfme_root_password.length') > 7)
           );
  }.property('controllers.deployment.model.cfme_root_password'),
  hasNoCFRootPassword: Ember.computed.not("hasCFRootPassword"),

  hasCFAdminPassword: function() {
    return (Ember.isPresent(this.get('controllers.deployment.model.cfme_admin_password')) &&
            (this.get('controllers.deployment.model.cfme_admin_password.length') > 7)
           );
  }.property('controllers.deployment.model.cfme_admin_password'),
  hasNoCFAdminPassword: Ember.computed.not("hasCFAdminPassword"),

  validCloudforms: function() {
    return this.get('hasInstallLocation') && this.get('hasCFRootPassword') && this.get('hasCFAdminPassword');
  }.property('hasInstallLocation', 'hasCFRootPassword', 'hasCFAdminPassword'),
  notValidCloudforms: Ember.computed.not("validCloudforms")

});
