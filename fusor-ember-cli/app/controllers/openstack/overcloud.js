import Ember from 'ember';
import DeploymentControllerMixin from "../../mixins/deployment-controller-mixin";
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import { EqualityValidator} from '../../utils/validators';

const OvercloudController = Ember.Controller.extend(DeploymentControllerMixin, NeedsDeploymentMixin, {
  isCloudForms: Ember.computed.alias("deploymentController.isCloudForms"),
  isOpenShift: Ember.computed.alias("deploymentController.isOpenShift"),
  openstackDeployment: Ember.computed.alias('model'),

  //TODO move password confirmations to transient data on the model
  confirmOvercloudPassword: Ember.computed.alias("deploymentController.confirmOvercloudPassword"),

  confirmOvercloudPasswordValidator: Ember.computed('openstackDeployment.overcloud_password', function() {
    return EqualityValidator.create({equals: this.get('openstackDeployment.overcloud_password')});
  }),

  nextStepRouteNameOvercloud: Ember.computed('isCloudForms', function() {
    if (this.get('isOpenShift')) {
      return 'openshift';
    } else if (this.get('isCloudForms')) {
      return 'cloudforms';
    } else {
      return 'subscriptions';
    }
  }),

  validOvercloudNetworks: Ember.computed(
    'openstackDeployment.isValidOvercloud',
    'confirmOvercloudPassword',
    'confirmOvercloudPasswordValidator',
    function () {
      return this.get('openstackDeployment.isValidOvercloud') &&
        this.get('confirmOvercloudPasswordValidator').isValid(this.get('confirmOvercloudPassword'));
    }),

  disableNextOvercloud: Ember.computed.not('validOvercloudNetworks')
});

export default OvercloudController;
