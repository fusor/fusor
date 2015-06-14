import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['deployment', 'subscriptions/credentials', 'subscriptions/management-application'],

  stepNumberSubscriptions: Ember.computed.alias("controllers.deployment.stepNumberSubscriptions"),

  disableTabManagementApplication: Ember.computed.not("model.isAuthenticated"),

  disableTabSelectSubsciptions: Ember.computed.alias("controllers.subscriptions/management-application.disableNextOnManagementApp"),

});
