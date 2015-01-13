import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  activate: function() {
    this.controllerFor('side-menu').set('etherpadName', '40'); //route-deployments-new
  },

  deactivate: function() {
    this.controllerFor('side-menu').set('etherpadName', '');
  }

});
