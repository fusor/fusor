import Ember from 'ember';

export default Ember.Controller.extend({
  stepNumberOpenstack: Ember.computed.alias("deploymentController.stepNumberOpenstack"),
  disableTabRegisterNodes: Ember.computed.empty("model.openstack_undercloud_password"),
  disableTabAssignNodes: Ember.computed.empty("model.openstack_undercloud_password"),
  validOpenStack: true //TODO
});
