import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['side-menu', 'deployment'],

  deployAsPlugin: false,
  isEmberCliMode: Ember.computed.not('deployAsPlugin'),
  isUpstream: false,

  isContainer: Ember.computed.alias("isUpstream"),

  showMainMenu: Ember.computed.and('isLoggedIn', 'isEmberCliMode'),
  showSideMenu: Ember.computed.alias("controllers.side-menu.showSideMenu"),

  isLoggedIn: true, //Ember.computed.alias("session.isAuthenticated"),

  loginUsername: Ember.computed.alias("session.currentUser.login"),

  nameRHCI: Ember.computed.alias("controllers.deployment.nameRHCI"),
  nameRhev: Ember.computed.alias("controllers.deployment.nameRhev"),
  nameOpenStack: Ember.computed.alias("controllers.deployment.nameOpenStack"),
  nameCloudForms: Ember.computed.alias("controllers.deployment.nameCloudForms"),
  nameSatellite: Ember.computed.alias("controllers.deployment.nameSatellite"),
  logoPath: Ember.computed.alias("controllers.deployment.logoPath"),

  actions: {
    invalidate: function(data) {
      return this.transitionTo('login');
    },

    signOut: function() {
      return this.transitionTo('login');
    },

  }
});
