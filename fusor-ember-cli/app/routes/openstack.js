import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.modelFor('deployment').get('openstack_deployment');
  },

  actions: {
    saveOpenstackDeployment() {
      let deployment = this.modelFor('deployment');
      let openstackDeployment = this.get('controller.model');
      if (!deployment.get('isStarted')) {
        openstackDeployment.save();
      }
    }
  }
});
