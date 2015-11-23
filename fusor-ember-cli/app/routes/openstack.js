import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Route.extend({

  model() {
    return this.modelFor('deployment');
  },

  setupController(controller, model) {
    controller.set('model', model);
    var stepNumberOpenstack = this.controllerFor('deployment').get('stepNumberOpenstack');
    return this.controllerFor('deployment').set('currentStepNumber', stepNumberOpenstack);
  },

  actions: {
    updatePlanParameters(params) {
      var deploymentId = this.modelFor('deployment').get('id'),
        token = Ember.$('meta[name="csrf-token"]').attr('content');

      return request({
        url: '/fusor/api/openstack/deployments/' + deploymentId + '/deployment_plans/overcloud/update_parameters',
        type: 'PUT',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": token
        },
        data: JSON.stringify({ 'parameters': params })
      }).then(
        function() {},
        function(error) {
          error = error.jqXHR;
          console.log('ERROR updating parameters');
          console.log(error);
        }
      );
    }
  }
});
