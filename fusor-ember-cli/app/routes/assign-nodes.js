import Ember from 'ember';
import request from 'ic-ajax';
import DeploymentRouteMixin from "../mixins/deployment-route-mixin";

export default Ember.Route.extend(DeploymentRouteMixin, {

  model() {
      var deploymentId = this.modelFor('deployment').get('id');
      return Ember.RSVP.hash({
          plan: this.store.findRecord('deployment-plan', deploymentId),
          images: this.store.query('image', {deployment_id: deploymentId}),
          nodes: this.store.query('node', {deployment_id: deploymentId}),
          profiles: this.store.query('flavor', {deployment_id: deploymentId}),
      });
  },

  setupController(controller, model) {
    controller.set('model', model);
    this.fixBadDefaults();
  },

  fixBadDefaults() {
    var id, value,
      existingParams = this.get('controller').get('model.plan.parameters'),
      newParams = [];

    if (!existingParams) {
      return;
    }

    existingParams.forEach(function(param) {
      id = param.get('id');
      value = param.get('value');
      if (id === 'Controller-1::NeutronPublicInterface' &&
        (!value || value === 'nic1')) {
        param.set('value', 'eth1');
        newParams.push({name: id, value: 'eth1'});
      }

      if (id === 'Compute-1::NovaComputeLibvirtType' &&
        (!value || value === 'qemu')) {
        param.set('value', 'kvm');
        newParams.push({name: id, value: 'kvm'});
      }
    });

    if (newParams.length > 0) {
      this.send('updatePlanParameters', newParams);
    }
  }
});
