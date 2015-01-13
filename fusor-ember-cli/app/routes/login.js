import Ember from 'ember';
//import UnauthenticatedRouteMixin from 'simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend({
//export default Ember.Route.extend(UnauthenticatedRouteMixin, {

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('errorMessage', null);
  }

});
