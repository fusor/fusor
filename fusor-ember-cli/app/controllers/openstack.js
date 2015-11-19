import Ember from 'ember';

export default Ember.Controller.extend({

  registerNodesController: Ember.inject.controller('register-nodes'),
  assignNodesController: Ember.inject.controller('assign-nodes'),

  stepNumberOpenstack: Ember.computed.alias("deploymentController.stepNumberOpenstack"),
  disableRegisterNodesNext: Ember.computed.alias("registerNodesController.disableRegisterNodesNext"),
  disableAssignNodesNext: Ember.computed.alias("assignNodesController.disableAssignNodesNext"),

  disableTabRegisterNodes: Ember.computed.empty("model.openstack_undercloud_password"),

  disableTabAssignNodes: Ember.computed("disableTabRegisterNodes", "disableRegisterNodesNext", function () {
     return (this.get('disableTabRegisterNodes') || this.get("disableRegisterNodesNext"));
  }),

  disableTabOvercloud: Ember.computed("disableTabAssignNodes", "disableAssignNodesNext", function () {
     return (this.get('disableTabAssignNodes') || this.get("disableAssignNodesNext"));
  }),

  validOpenStack: true //TODO
});
