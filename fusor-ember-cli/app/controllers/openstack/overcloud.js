import Ember from 'ember';
import DeploymentControllerMixin from "../../mixins/deployment-controller-mixin";
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import { EqualityValidator} from '../../utils/validators';

const OvercloudController = Ember.Controller.extend(DeploymentControllerMixin, NeedsDeploymentMixin, {
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),
  isOpenShift: Ember.computed.alias("deploymentController.isOpenShift"),

  //TODO move password confirmations to transient data on the model
  confirmOvercloudPassword: Ember.computed.alias("deploymentController.confirmOvercloudPassword"),

  openstackDeployment: Ember.computed.alias('model'),
  externalNetworkInterface: Ember.computed.alias('openstackDeployment.overcloud_ext_net_interface'),
  overcloudPrivateNet: Ember.computed.alias('openstackDeployment.overcloud_private_net'),
  overcloudFloatNet: Ember.computed.alias('openstackDeployment.overcloud_float_net'),
  overcloudFloatGateway: Ember.computed.alias('openstackDeployment.overcloud_float_gateway'),
  overcloudPassword: Ember.computed.alias("openstackDeployment.overcloud_password"),
  overcloudLibvirtType: Ember.computed.alias("openstackDeployment.overcloud_libvirt_type"),
  overcloudPrivateNetValidator: Ember.computed.alias('openstackDeployment.validations.overcloud_private_net'),
  overcloudFloatNetValidator: Ember.computed.alias('openstackDeployment.validations.overcloud_float_net'),
  overcloudFloatGatewayValidator: Ember.computed.alias('openstackDeployment.validations.overcloud_float_gateway'),

  confirmOvercloudPasswordValidator: Ember.computed('overcloudPassword', function() {
    return EqualityValidator.create({equals: this.get('overcloudPassword')});
  }),

  nextStepRouteNameOvercloud: Ember.computed('isCloudForms', function() {
    if (this.get('isCloudForms')) {
      return 'cloudforms';
    } else if (this.get('isOpenShift')) {
      return 'openshift';
    } else {
      return 'subscriptions';
    }
  }),

  isValidOvercloudPassword: Ember.computed('overcloudPassword', 'confirmOvercloudPassword', function () {
    return Ember.isPresent(this.get('overcloudPassword')) &&
      this.get('overcloudPassword') === this.get('confirmOvercloudPassword');
  }),

  validOvercloudNetworks: Ember.computed('openstackDeployment.isValidOvercloud', 'isValidOvercloudPassword', function () {
    return this.get('openstackDeployment.isValidOvercloud') && this.get('isValidOvercloudPassword');
  }),

  disableNextOvercloud: Ember.computed.not('validOvercloudNetworks')
});

export default OvercloudController;
