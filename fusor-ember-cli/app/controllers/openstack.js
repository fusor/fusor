import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['deployment', 'undercloud-deploy'],

  stepNumberOpenstack: Ember.computed.alias("controllers.deployment.stepNumberOpenstack"),
  disableTabRegisterNodes: Ember.computed.empty("model.openstack_undercloud_password"),
  disableTabAssignNodes: Ember.computed.empty("model.openstack_undercloud_password"),
  validOpenStack: true //TODO
});
