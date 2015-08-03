import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['deployment'],

  deployAsPlugin: true,
  isEmberCliMode: Ember.computed.not('deployAsPlugin'),
  isUpstream: false,

  isContainer: Ember.computed.alias("isUpstream"),

  isLoggedIn: true, //Ember.computed.alias("session.isAuthenticated"),

  loginUsername: Ember.computed.alias("session.currentUser.login"),

  nameRHCI: Ember.computed.alias("controllers.deployment.nameRHCI"),
  nameRhev: Ember.computed.alias("controllers.deployment.nameRhev"),
  nameOpenStack: Ember.computed.alias("controllers.deployment.nameOpenStack"),
  nameCloudForms: Ember.computed.alias("controllers.deployment.nameCloudForms"),
  nameSatellite: Ember.computed.alias("controllers.deployment.nameSatellite"),
  logoPath: Ember.computed.alias("controllers.deployment.logoPath"),

  actions: {
    invalidate: function() {
      return this.transitionTo('login');
    },

    signOut: function() {
      return this.transitionTo('login');
    },

  }
});
