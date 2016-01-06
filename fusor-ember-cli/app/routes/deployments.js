import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('deployment');
  },

  actions: {
    deleteDeployment(item) {
      return this.store.findRecord('deployment', item.get('id')).then(function(deployment) {
        deployment.deleteRecord();
        return deployment.save();
      });
    },

    willTransition() {
      return this.controllerFor('deployment').set('isBackToDeployments', true);
    }
  }

});
