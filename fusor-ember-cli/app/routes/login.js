import Ember from 'ember';
//import UnauthenticatedRouteMixin from 'simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend({
//export default Ember.Route.extend(UnauthenticatedRouteMixin, {

  beforeModel: function(transition) {
    if (!this.controllerFor('application').get('isEmberCliMode')) {
      return this.transitionTo('rhci');
    };
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('errorMessage', null);
  }

});
