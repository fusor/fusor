import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  step2RouteName: Ember.computed.alias("deploymentController.step2RouteName"),

  analyticsColor: function() {
    if (this.get('isStarted')) { return 'disabled'; } else { return ''; }
  }.property('isStarted')


});
