import Ember from 'ember';

export default Ember.Controller.extend({
  deploymentController: Ember.inject.controller('deployment'),

  deployAsPlugin: true,
  isEmberCliMode: Ember.computed.not('deployAsPlugin'),
  isUpstream: false,

  isContainer: Ember.computed.alias("isUpstream"),

  isLoggedIn: true, //Ember.computed.alias("session.isAuthenticated"),

  loginUsername: Ember.computed.alias("session.currentUser.login"),

  nameRHCI: Ember.computed.alias("deploymentController.nameRHCI"),
  nameRhev: Ember.computed.alias("deploymentController.nameRhev"),
  nameOpenStack: Ember.computed.alias("deploymentController.nameOpenStack"),
  nameCloudForms: Ember.computed.alias("deploymentController.nameCloudForms"),
  nameSatellite: Ember.computed.alias("deploymentController.nameSatellite"),
  logoPath: Ember.computed.alias("deploymentController.logoPath"),

  actions: {
    invalidate() {
      return this.transitionToRoute('login');
    },

    signOut() {
      return this.transitionToRoute('login');
    }
  }

});
