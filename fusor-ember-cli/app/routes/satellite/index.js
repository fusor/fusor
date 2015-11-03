import Ember from 'ember';

export default Ember.Route.extend({

  deactivate: function() {
    return this.send('saveDeployment', null);
  },

  actions: {
    willTransition: function () {
      return this.controllerFor('deployment').set('isBackToDeployments', false);
    }
  }

});
