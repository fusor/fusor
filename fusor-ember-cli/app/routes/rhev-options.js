import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Route.extend({
  model() {
    var deploymentId = this.modelFor('deployment').get('id');
    return request({
      url: `/fusor/api/v21/deployments/${deploymentId}/compatible_cpu_families`,
      type: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": Ember.$('meta[name="csrf-token"]').attr('content')
      }
    });
  },

  setupController(controller, model) {
    controller.set('model', model);

    // initialize the deployment cpu family to the default returned family
    if (this.modelFor('deployment').get('rhev_cpu_type') === null) {
      this.modelFor('deployment').set('rhev_cpu_type', model.default_family);
    }
  },

  deactivate() {
    return this.send('saveDeployment', null);
  }
});
