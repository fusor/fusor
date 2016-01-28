import Ember from 'ember';
import DeploymentControllerMixin from "../../mixins/deployment-controller-mixin";
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import ValidationUtil from '../../utils/validation-util';

let OvercloudController = Ember.Controller.extend(
  DeploymentControllerMixin,
  NeedsDeploymentMixin,
{
  openStack: Ember.computed.alias("deploymentController.openStack"),
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),
  openstackOvercloudPrivateNet: Ember.computed.alias('deploymentController.model.openstack_overcloud_private_net'),
  openstackOvercloudFloatNet: Ember.computed.alias('deploymentController.model.openstack_overcloud_float_net'),
  openstackOvercloudFloatGateway: Ember.computed.alias('deploymentController.model.openstack_overcloud_float_gateway'),
  externalNetworkInterface: Ember.computed.alias('openStack.externalNetworkInterface'),
  overcloudPassword: Ember.computed.alias("deploymentController.model.openstack_overcloud_password"),
  confirmOvercloudPassword: Ember.computed.alias("deploymentController.confirmOvercloudPassword"),

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

  validOvercloudNetworks: Ember.computed(
    'openStack.externalNetworkInterface',
    'openstackOvercloudPrivateNet',
    'openstackOvercloudFloatNet',
    'openstackOvercloudFloatGateway',
    'isValidOvercloudPassword',
    'isValidPrivateNetworkRange',
    'isValidFloatingIpNetworkRange',
    'isValidFloatingIpGateway',
    function () {
      return Ember.isPresent(this.get('openStack.externalNetworkInterface')) &&
        Ember.isPresent(this.get('openstackOvercloudPrivateNet')) &&
        Ember.isPresent(this.get('openstackOvercloudFloatNet')) &&
        Ember.isPresent(this.get('openstackOvercloudFloatGateway')) &&
        this.get('isValidOvercloudPassword') &&
        this.get('isValidPrivateNetworkRange') &&
        this.get('isValidFloatingIpNetworkRange') &&
        this.get('isValidFloatingIpGateway');
    }),

  disableNextOvercloud: Ember.computed.not('validOvercloudNetworks'),

  isValidPrivateNetworkRange: Ember.computed(
    'openstackOvercloudPrivateNet',
    function() {
      return ValidationUtil.validateIpRangeAndFormat(
        this.get('openstackOvercloudPrivateNet'));
    }
  ),

  isValidFloatingIpNetworkRange: Ember.computed(
    'openstackOvercloudFloatNet',
    function() {
      return ValidationUtil.validateIpRangeAndFormat(
        this.get('openstackOvercloudFloatNet'));
    }
  ),

  isValidFloatingIpGateway: Ember.computed(
    'openstackOvercloudFloatGateway',
    function() {
      return ValidationUtil.validateIpRange(
        this.get('openstackOvercloudFloatGateway'));
    }
  )
});

export default OvercloudController;
