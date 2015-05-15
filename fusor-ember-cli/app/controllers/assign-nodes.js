import Ember from 'ember';
import DeploymentControllerMixin from "../mixins/deployment-controller-mixin";

export default Ember.Controller.extend(DeploymentControllerMixin, {

  needs: ['deployment', 'register-nodes'],
  register: Ember.computed.alias("controllers.register-nodes"),

  nodeProfiles:function() {
    return this.get('register').get('model.nodeProfiles');
  }.property('register.model.nodeProfiles', 'register.model.nodeProfiles.length'),

  numProfiles: function() {
    var profiles = this.get('register.model.nodeProfiles');
    return profiles.length;
  }.property('model.nodeProfiles', 'model.nodeProfiles.length'),

  actions: {
    editRoles: function() {
      alert("Edit the role now");
    }
  },

  disableAssignNodesNext: function() {
    var freeNodeCount = 0;
    var profiles = this.get('nodeProfiles');
    if (profiles) {
      for (var i = 0; i < profiles.length; i++ ) {
        freeNodeCount += profiles[i].freeNodes;
      }
    }
    return (freeNodeCount < 4);
  }.property('nodeProfiles'),

  nextStepRouteName: function() {
    return ('');
  }.property('step2RoutName', 'step3RouteName')
});
