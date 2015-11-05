import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.findAll('deployment');
  },

  actions: {
    deleteDeployment: function (item) {
      this.controllerFor('deployments').set('isCloseModal', true);
      return this.store.findRecord('deployment', item.get('id')).then(function(deployment) {
        deployment.deleteRecord();
        return deployment.save();
      });
    },

    willTransition: function () {
      return this.controllerFor('deployment').set('isBackToDeployments', true);
    }
  }

});
