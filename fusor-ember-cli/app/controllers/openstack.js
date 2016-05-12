import Ember from 'ember';
import NeedsDeploymentMixin from '../mixins/needs-deployment-mixin';

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  //TODO move password confirmations to transient data on the model
  confirmOvercloudPassword: Ember.computed.alias("deploymentController.confirmOvercloudPassword"),
  openstackDeployment: Ember.computed.alias('deploymentController.model.openstack_deployment'),

  registerNodesController: Ember.inject.controller('openstack/register-nodes'),
  assignNodesController: Ember.inject.controller('openstack/assign-nodes'),
  overcloudController: Ember.inject.controller('openstack/overcloud'),

  stepNumberOpenstack: Ember.computed.alias('deploymentController.stepNumberOpenstack'),
  disableRegisterNodesNext: Ember.computed.alias('registerNodesController.disableRegisterNodesNext'),
  disableAssignNodesNext: Ember.computed.alias('assignNodesController.disableAssignNodesNext'),
  disableNextOvercloud: Ember.computed.alias('overcloudController.disableNextOvercloud'),

  disableTabRegisterNodes: Ember.computed.not('openstackDeployment.isUndercloudDeployed'),

  disableTabAssignNodes: Ember.computed(
    'openstackDeployment.isUndercloudDeployed',
    'openstackDeployment.areNodesRegistered',
    function () {
      return !this.get('openstackDeployment.isUndercloudDeployed') ||
       !this.get('openstackDeployment.areNodesRegistered');
    }),

  disableTabOvercloud: Ember.computed(
    'openstackDeployment.isUndercloudDeployed',
    'openstackDeployment.areNodesRegistered',
    'openstackDeployment.hasValidNodeAssignments',
    function () {
      return !this.get('openstackDeployment.isUndercloudDeployed') ||
        !this.get('openstackDeployment.areNodesRegistered') ||
        !this.get('openstackDeployment.hasValidNodeAssignments');
    }),

  validOpenStack: Ember.computed(
    'confirmOvercloudPassword',
    'openstackDeployment.overcloud_password',
    'openstackDeployment.areAllAttributesValid',
    function () {
      //TODO move password confirmations to transient data on the model and validate them there
      return this.get('openstackDeployment.areAllAttributesValid') &&
        this.get('openstackDeployment.overcloud_password') === this.get('confirmOvercloudPassword');
    })
});
