import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['deployment', 'undercloud-deploy'],

  stepNumberOpenstack: Ember.computed.alias("controllers.deployment.stepNumberOpenstack"),
  disableTabRegisterNodes: Ember.computed.alias("controllers.undercloud-deploy.disableTabRegisterNodes"),
  disableTabAssignNodes: Ember.computed.alias("controllers.undercloud-deploy.disableTabAssignNodes"),
  validOpenStack: true //TODO
});
