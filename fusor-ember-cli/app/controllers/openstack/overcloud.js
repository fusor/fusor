import Ember from 'ember';
import DeploymentControllerMixin from "../../mixins/deployment-controller-mixin";
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, NeedsDeploymentMixin, {

  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),

  nextStepRouteNameOvercloud: Ember.computed('isCloudForms', function() {
    if (this.get('isCloudForms')) {
      return 'cloudforms';
    } else {
      return 'subscriptions';
    }
  }),

  isValidPrivateNetworkRange: Ember.computed('model.deployment.openstack_overcloud_private_net', function() {
      // TODO
      return true;
  }),

  isValidPrivateFloatRange: Ember.computed('model.deployment.openstack_overcloud_float_net', function() {
      // TODO
      return true;
  }),

  isValidOvercloudPassword: Ember.computed('isAutoPwd', 'overcloudPassword','confirmOvercloudPassword', function () {
      if (this.get('isAutoPwd')) {
          return true;
      } else {
          return Ember.isPresent(this.get('overcloudPassword')) &&
                 this.get('overcloudPassword') === this.get('confirmOvercloudPassword');
      }
    }
  ),

  validOvercloudNetworks: Ember.computed('neutronPublicInterface',
                                         'model.deployment.openstack_overcloud_private_net',
                                         'model.deployment.openstack_overcloud_float_net',
                                         'model.deployment.openstack_overcloud_float_gateway',
                                         'isValidPrivateNetworkRange',
                                         'isValidPrivateFloatRange',
                                         'isValidOvercloudPassword',
                                          function() {
    return (Ember.isPresent(this.get('neutronPublicInterface')) &&
            Ember.isPresent(this.get('model.deployment.openstack_overcloud_private_net')) &&
            Ember.isPresent(this.get('model.deployment.openstack_overcloud_float_net')) &&
            Ember.isPresent(this.get('model.deployment.openstack_overcloud_float_gateway')) &&
            this.get('isValidPrivateNetworkRange') &&
            this.get('isValidPrivateFloatRange') &&
            this.get('isValidOvercloudPassword')
           );
  }),

  disableNextOvercloud: Ember.computed.not('validOvercloudNetworks'),

  overcloudPassword: Ember.computed.alias("deploymentController.model.openstack_overcloud_password"),
  confirmOvercloudPassword: Ember.computed.alias("deploymentController.confirmOvercloudPassword"),

  isAutoPwd: Ember.computed.alias("deploymentController.model.openstack_overcloud_autogenerate_password"),

  pwdType: Ember.computed('isAutoPwd', function() {
    return (this.get('isAutoPwd') ? "autogenerate" : "specify");
  }),

  isAutoSelected: Ember.computed('pwdType', function() {
    return (this.get('pwdType') === 'autogenerate');
  }),
  isPwdSpecified: Ember.computed.not('isAutoSelected'),

  actions: {
    pwdTypeChanged() {
      return this.get('deploymentController').set('model.openstack_overcloud_autogenerate_password', this.get('isAutoSelected'));
    }
  }

});
