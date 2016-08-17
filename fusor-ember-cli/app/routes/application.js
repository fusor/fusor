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
    },
    userTimeout() {
      this.eventBus.trigger('displayErrorModal', {
        errorMessage: 'It looks like your session has timed out. Try logging back in again to continue.',
        okayCallback: () => {
          document.location.pathname = '/';
        }
      });
    }
  }
});
