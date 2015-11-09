import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  isUpstream: Ember.computed.alias("applicationController.isUpstream"),
  stepNumberSubscriptions: Ember.computed.alias("deploymentController.stepNumberSubscriptions"),
  numSubscriptionsRequired: Ember.computed.alias("deploymentController.numSubscriptionsRequired"),
  isStarted: Ember.computed.alias("deploymentController.isStarted"),
  isDisconnected: Ember.computed.alias('deploymentController.model.is_disconnected'),

  hasSubscriptionPools: Ember.computed('subscriptionPools.[]', function() {
      return (this.get('subscriptionPools.length') > 0);
  }),

  hasSubscriptionSavedInModel: Ember.computed('model.[]', function() {
      return (this.get('model.length') > 0);
  }),

  contractNumbersInPool: Ember.computed('subscriptionPools.[]', 'hasSubscriptionPools', function() {
    if (this.get('hasSubscriptionPools')) {
      return this.get('subscriptionPools').getEach("contractNumber");
    }
  }),

  contractNumbersInModel: Ember.computed('model.[]', 'hasSubscriptionSavedInModel', function() {
    if (this.get('hasSubscriptionSavedInModel')) {
      return this.get('model').getEach("contract_number");
    }
  }),

  contractNumbersInModelNotInPool: Ember.computed(
    'contractNumbersInPool',
    'contractNumbersInModel',
    'hasSubscriptionSavedInModel',
    function() {
       if (this.get('hasSubscriptionSavedInModel')) {
          return this.get('contractNumbersInModel').removeObjects(Ember.A(this.get('contractNumbersInPool')));
       } else {
         return Ember.A([]);
       }
    }
  ),

  hasContractNumbersInModelNotInPool: Ember.computed('contractNumbersInModelNotInPool', function() {
     return (this.get('contractNumbersInModelNotInPool.length') > 0);
  }),

  hasSubscriptionsToAttach: Ember.computed('model.[]', function() {
    return (this.get('model.length') > 0);
  })

});
