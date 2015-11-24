import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    var deployment = this.modelFor('deployment');
    return Ember.RSVP.hash({
      deployment: deployment,
      plan: this.store.findRecord('deployment-plan', deployment.get('id'))
    });
  },

  setupController(controller, model) {
    var existingParams;
    controller.set('model', model);

    existingParams = this.get('controller').get('model.plan.parameters');

    if (!existingParams) {
      return;
    }

    existingParams.forEach(function (param) {
      if (param.get('id') === 'Controller-1::NeutronPublicInterface') {
        controller.set('neutronPublicInterface', param.get('value'));
      }
    });
  },

  deactivate() {
    this.updateNeutronPublicInterface();
    this.send('updatePlanParameters', [{
      name: 'Controller-1::NeutronPublicInterface',
      value: this.get('controller').get('neutronPublicInterface')
    }]);
    return this.send('saveDeployment', null);
  },

  updateNeutronPublicInterface() {
    var controller = this.get('controller'),
      existingParams = controller.get('model.plan.parameters');

    if (!existingParams) {
      return;
    }

    existingParams.forEach(function (param) {
      if (param.get('id') === 'Controller-1::NeutronPublicInterface') {
        param.set('value', controller.get('neutronPublicInterface'));
      }
    });
  }
});
