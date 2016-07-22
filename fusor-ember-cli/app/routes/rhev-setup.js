import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, model) {
    controller.set('model', model);
    const rhevSetup = model.get('rhev_is_self_hosted') ?
      'selfhost' : 'rhevhost';
    controller.set('rhevSetup', rhevSetup);
  },

  deactivate() {
    return this.send('saveDeployment', null);
  }
});
