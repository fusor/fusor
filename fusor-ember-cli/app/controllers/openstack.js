import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['undercloud-deploy'],
  stepNumberOpenstack: Ember.computed.alias("controllers.undercloud-deploy.stepNumberOpenstack"),
  disableTabRegisterNodes: Ember.computed.alias("controllers.undercloud-deploy.disableTabRegisterNodes"),
  disableTabAssignNodes: Ember.computed.alias("controllers.undercloud-deploy.disableTabAssignNodes")
});
