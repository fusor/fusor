import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.modelFor('deployment').get('openstack_deployment');
  },

  actions: {
    saveOpenstackDeployment() {
      var openstackDeployment = this.get('controller.model');
      openstackDeployment.save().then(
        result => {

        },
        error => {
          //TODO
        });
    }
  }
});
