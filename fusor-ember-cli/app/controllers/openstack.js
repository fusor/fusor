import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  registerNodesController: Ember.inject.controller('register-nodes'),
  assignNodesController: Ember.inject.controller('assign-nodes'),
  overcloudController: Ember.inject.controller('openstack/overcloud'),

  stepNumberOpenstack: Ember.computed.alias("deploymentController.stepNumberOpenstack"),
  disableRegisterNodesNext: Ember.computed.alias("registerNodesController.disableRegisterNodesNext"),
  disableAssignNodesNext: Ember.computed.alias("assignNodesController.disableAssignNodesNext"),
  disableNextOvercloud: Ember.computed.alias("overcloudController.disableNextOvercloud"),

  disableTabRegisterNodes: Ember.computed.empty("model.openstack_undercloud_password"),

  disableTabAssignNodes: Ember.computed("disableTabRegisterNodes", "disableRegisterNodesNext", function () {
     return (this.get('disableTabRegisterNodes') || this.get("disableRegisterNodesNext"));
  }),

  disableTabOvercloud: Ember.computed("disableTabAssignNodes", "disableAssignNodesNext", function () {
     return (this.get('disableTabAssignNodes') || this.get("disableAssignNodesNext"));
  }),

  isValidRegisterNodes: Ember.computed.not('disableRegisterNodesNext'),
  isValidAssignNodes: Ember.computed.not('disableTabAssignNodes'),
  isValidOvercloud: Ember.computed.not('disableNextOvercloud'),

  validOpenStack: Ember.computed('isValidRegisterNodes',
                                 'isValidAssignNodes',
                                 'isValidOvercloud', function() {
      return this.get('isValidRegisterNodes') &&
             this.get('isValidAssignNodes') &&
             this.get('isValidOvercloud');
  }),

});
