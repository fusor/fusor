import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['deployment', 'subscriptions/credentials'],

  stepNumberSubscriptions: Ember.computed.alias("controllers.deployment.stepNumberSubscriptions"),

  disableTabManagementApplication: Ember.computed.not("model.isAuthenticated"),
  disableTabSelectSubsciptions: Ember.computed.not("model.isAuthenticated"),

});
