import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel: function(transition) {
    if ( this.controllerFor('application').get('deployAsPlugin') || this.get('session.isAuthenticated') ) {
      return this.transitionTo('deployment-new.start');
    };
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('errorMessage', null);
  }

});
