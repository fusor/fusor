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

  isStarted: function() {
    return !!(this.get('controllers.deployment.foreman_task_uuid'));
  }.property('controllers.deployment.foreman_task_uuid.foreman_task_uuid'),

  isNewDeployment: false,
  deploymentIsStarted: function() {
    if (this.get('isNewDeployment')) {
      return false;
    } else {
      return this.get('isStarted');
    }
  }.property('isStarted', 'isNewDeployment'),

  actions: {
    invalidate: function() {
      return this.transitionTo('login');
    },

    signOut: function() {
      return this.transitionTo('login');
    },

  }
});
