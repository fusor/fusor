import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  needs: ['application'],

  isUpstream: Ember.computed.alias("controllers.application.isUpstream"),
  stepNumberSubscriptions: Ember.computed.alias("controllers.deployment.stepNumberSubscriptions"),
  numSubscriptionsRequired: Ember.computed.alias("controllers.deployment.numSubscriptionsRequired"),
  isStarted: Ember.computed.alias("controllers.deployment.isStarted"),
  isDisconnected: Ember.computed.alias('controllers.deployment.model.is_disconnected'),

  hasSubscriptionPools: function() {
      return (this.get('subscriptionPools.length') > 0);
  }.property('subscriptionPools.[]'),

  hasSubscriptionSavedInModel: function() {
      return (this.get('model.length') > 0);
  }.property('model.[]'),

  contractNumbersInPool: function() {
    if (this.get('hasSubscriptionPools')) {
      return this.get('subscriptionPools').getEach("contractNumber");
    }
  }.property('subscriptionPools.[]', 'hasSubscriptionPools'),

  contractNumbersInModel: function() {
    if (this.get('hasSubscriptionSavedInModel')) {
      return this.get('model').getEach("contract_number");
    }
  }.property('model.[]', 'hasSubscriptionSavedInModel'),

  contractNumbersInModelNotInPool: function() {
     if (this.get('hasSubscriptionSavedInModel')) {
        return this.get('contractNumbersInModel').removeObjects(Ember.A(this.get('contractNumbersInPool')));
     } else {
       return Ember.A([]);
     }
  }.property('contractNumbersInPool', 'contractNumbersInModel', 'hasSubscriptionSavedInModel'),

  hasContractNumbersInModelNotInPool: function() {
     return (this.get('contractNumbersInModelNotInPool.length') > 0);
  }.property('contractNumbersInModelNotInPool'),

  hasSubscriptionsToAttach: function() {
    return (this.get('model.length') > 0);
  }.property('model.[]')

});
