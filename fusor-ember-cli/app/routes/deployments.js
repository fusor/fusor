import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('deployment');
  },

  actions: {
    deleteDeployment: function (item) {
      this.controllerFor('deployments').set('isCloseModal', true);
      return this.store.find('deployment', item.get('id')).then(function(deployment) {
        deployment.deleteRecord();
        return deployment.save();
      });
    },
  }

});
