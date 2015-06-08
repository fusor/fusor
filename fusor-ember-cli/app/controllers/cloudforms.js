import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['deployment'],
  stepNumberCloudForms: Ember.computed.alias("controllers.deployment.stepNumberCloudForms"),

  hasInstallLocation: function() {
    return Ember.isPresent(this.get('controllers.deployment.cfme_install_loc'));
  }.property('controllers.deployment.cfme_install_loc'),
  hasNoInstallLocation: Ember.computed.not("hasInstallLocation"),

  hasCFRootPassword: function() {
    return (Ember.isPresent(this.get('controllers.deployment.cfme_root_password')) &&
            (this.get('controllers.deployment.cfme_root_password.length') > 7)
           );

  }.property('controllers.deployment.cfme_root_password'),
  hasNoCFRootPassword: Ember.computed.not("hasCFRootPassword"),

  validCloudforms: function() {
    return this.get('hasInstallLocation') && this.get('hasCFRootPassword');
  }.property('hasInstallLocation', 'hasCFRootPassword'),

});
