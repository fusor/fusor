import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  isUpstream: Ember.computed.alias("applicationController.isUpstream"),
  stepNumberSubscriptions: Ember.computed.alias("deploymentController.stepNumberSubscriptions"),
  numSubscriptionsRequired: Ember.computed.alias("deploymentController.numSubscriptionsRequired"),
  isStarted: Ember.computed.alias("deploymentController.isStarted"),
  isDisconnected: Ember.computed.alias('deploymentController.model.is_disconnected'),

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
