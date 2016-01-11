import Ember from 'ember';
import DeploymentControllerMixin from "../../mixins/deployment-controller-mixin";
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import ValidationUtil from '../../utils/validation-util';

let OvercloudController = Ember.Controller.extend(
  DeploymentControllerMixin,
  NeedsDeploymentMixin,
{
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),

  nextStepRouteNameOvercloud: Ember.computed('isCloudForms', function() {
    if (this.get('isCloudForms')) {
      return 'cloudforms';
    } else {
      return 'subscriptions';
    }
  }),

  isValidOvercloudPassword: Ember.computed('overcloudPassword', 'confirmOvercloudPassword', function () {
    return Ember.isPresent(this.get('overcloudPassword')) &&
      this.get('overcloudPassword') === this.get('confirmOvercloudPassword');
  }),

  validOvercloudNetworks: Ember.computed('neutronPublicInterface',
                                         'model.deployment.openstack_overcloud_private_net',
                                         'model.deployment.openstack_overcloud_float_net',
                                         'model.deployment.openstack_overcloud_float_gateway',
                                         'isValidOvercloudPassword',
                                         'isValidPrivateNetworkRange',
                                         'isValidFloatingIpNetworkRange',
                                         'isValidFloatingIpGateway',
                                          function() {
    return (Ember.isPresent(this.get('neutronPublicInterface')) &&
            Ember.isPresent(this.get('model.deployment.openstack_overcloud_private_net')) &&
            Ember.isPresent(this.get('model.deployment.openstack_overcloud_float_net')) &&
            Ember.isPresent(this.get('model.deployment.openstack_overcloud_float_gateway')) &&
            this.get('isValidOvercloudPassword') &&
            this.get('isValidPrivateNetworkRange') &&
            this.get('isValidFloatingIpNetworkRange') &&
            this.get('isValidFloatingIpGateway'));
  }),

  disableNextOvercloud: Ember.computed.not('validOvercloudNetworks'),

  overcloudPassword: Ember.computed.alias("deploymentController.model.openstack_overcloud_password"),
  confirmOvercloudPassword: Ember.computed.alias("deploymentController.confirmOvercloudPassword"),

  isValidPrivateNetworkRange: Ember.computed(
    'model.deployment.openstack_overcloud_private_net',
    function() {
      return ValidationUtil.validateIpRangeAndFormat(
        this.get('model.deployment.openstack_overcloud_private_net'));
    }
  ),

  isValidFloatingIpNetworkRange: Ember.computed(
    'model.deployment.openstack_overcloud_float_net',
    function() {
      return ValidationUtil.validateIpRangeAndFormat(
        this.get('model.deployment.openstack_overcloud_float_net'));
    }
  ),

  isValidFloatingIpGateway: Ember.computed(
    'model.deployment.openstack_overcloud_float_gateway',
    function() {
      return ValidationUtil.validateIpRange(
        this.get('model.deployment.openstack_overcloud_float_gateway'));
    }
  ),
});

export default OvercloudController;
