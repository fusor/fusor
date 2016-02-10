import Ember from 'ember';
import DeploymentControllerMixin from "../../mixins/deployment-controller-mixin";
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import { PresenceValidator, EqualityValidator, IpRangeValidator, CidrValidator} from '../../utils/validators';

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

  ipValidator: IpRangeValidator.create({}),
  cidrValidator: CidrValidator.create({}),
  confirmOvercloudPasswordValidator: Ember.computed('overcloudPassword', function() {
    return EqualityValidator.create({equals: this.get('overcloudPassword')});
  }),

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
      return this.get('cidrValidator').isValid(this.get('openstackOvercloudPrivateNet'));
    }
  ),

  isValidFloatingIpNetworkRange: Ember.computed(
    'openstackOvercloudFloatNet',
    function() {
      return this.get('cidrValidator').isValid(this.get('openstackOvercloudFloatNet'));
    }
  ),

  isValidFloatingIpGateway: Ember.computed(
    'openstackOvercloudFloatGateway',
    function() {
      return this.get('ipValidator').isValid(this.get('openstackOvercloudFloatGateway'));
    }
  )
});

export default OvercloudController;
