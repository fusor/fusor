import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  isDisconnected: Ember.computed.alias('deploymentController.isDisconnected'),

  backRouteNameReviewSubs: Ember.computed('isDisconnected', function() {
    if (this.get('isDisconnected')) {
      return 'subscriptions.credentials';
    } else {
      return 'subscriptions.select-subscriptions';
    }
  }),

  sortProps: ['contract_number'],
  sortedModel: Ember.computed.sort('model', 'sortProps'),

});
