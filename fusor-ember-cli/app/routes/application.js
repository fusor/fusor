// app/routes/application.js
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('deployment');
  },

  actions: {
    invalidateSession() {
      return this.transitionTo('login');
    },
    loading() {
      this.controllerFor('deployments').set('isLoading', true);
    }
  }
});
