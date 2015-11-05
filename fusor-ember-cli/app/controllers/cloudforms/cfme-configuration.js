import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  needs: ['cloudforms'],

  cfmeRootPassword: Ember.computed.alias("controllers.deployment.model.cfme_root_password"),
  cfmeAdminPassword: Ember.computed.alias("controllers.deployment.model.cfme_admin_password"),
  isSubscriptions: Ember.computed.alias("controllers.deployment.isSubscriptions"),
  notValidCloudforms: Ember.computed.alias("controllers.cloudforms.notValidCloudforms"),

  nextRouteNameAfterCFME: function() {
    if (this.get('isSubscriptions')) {
      return 'subscriptions';
    } else {
      return 'review';
    }
  }.property('isSubscriptions')
});
