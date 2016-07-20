import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {
  stepNumberSubscriptions: Ember.computed.alias("deploymentController.stepNumberSubscriptions"),
  isStarted: Ember.computed.alias("deploymentController.isStarted"),
  isDisconnected: Ember.computed.alias("deploymentController.model.is_disconnected"),

  disableTabManagementApplication: Ember.computed('model.isAuthenticated', 'isStarted', function() {
    return (!this.get('isStarted') && !this.get('model.isAuthenticated'));
  }),

  disableTabReviewSubsciptions: Ember.computed.empty("deploymentController.model.manifest_file"),

  disableTabSelectSubsciptions: Ember.computed('model.isAuthenticated', 'upstreamConsumerUuid', function() {
    return (Ember.isBlank(this.get('upstreamConsumerUuid')) || !this.get('model.isAuthenticated'));
  }),

  backRouteFromSubscriptions: Ember.computed(
    'isRhev',
    'isOpenStack',
    'isOpenShift',
    'isCloudForms',
    function() {
      if (this.get('isCloudForms')) {
        return 'cloudforms.cfme-configuration';
      } else if (this.get('isOpenShift')) {
        return 'openshift.openshift-configuration';
      } else if (this.get('isOpenStack')) {
        return 'openstack.overcloud';
      } else if (this.get('isRhev')) {
        return 'storage';
      } else {
        return 'configure-environment';
      }
    }
  )
});
