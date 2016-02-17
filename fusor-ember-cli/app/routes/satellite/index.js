import Ember from 'ember';

export default Ember.Route.extend({

  deactivate() {
    let deploymentName = this.get('controller.model.name');
    if (Ember.isPresent(deploymentName)) {
      this.set('controller.model.name', deploymentName.trim());
    }
    return this.send('saveDeployment', null);
  },

  actions: {
    willTransition() {
      return this.controllerFor('deployment').set('isBackToDeployments', false);
    }
  }

});
