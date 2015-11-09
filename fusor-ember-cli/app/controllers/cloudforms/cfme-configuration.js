import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  cloudformsController: Ember.inject.controller('cloudforms'),

  cfmeRootPassword: Ember.computed.alias("deploymentController.model.cfme_root_password"),
  cfmeAdminPassword: Ember.computed.alias("deploymentController.model.cfme_admin_password"),
  isSubscriptions: Ember.computed.alias("deploymentController.isSubscriptions"),
  notValidCloudforms: Ember.computed.alias("cloudformsController.notValidCloudforms"),

  nextRouteNameAfterCFME: Ember.computed('isSubscriptions', function() {
    if (this.get('isSubscriptions')) {
      return 'subscriptions';
    } else {
      return 'review';
    }
  })
});
