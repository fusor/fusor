import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  rhevIsSelfHosted: Ember.computed.alias("deploymentController.model.rhev_is_self_hosted"),

  rhevSetup: Ember.computed('rhevIsSelfHosted', function() {
    return (this.get('rhevIsSelfHosted') ? "selfhost" : "rhevhost");
  }),

  rhevSetupTitle: Ember.computed('rhevIsSelfHosted', function() {
    return (this.get('rhevIsSelfHosted') ? "Self Hosted" : "Host + Engine");
  }),

  isSelfHosted: Ember.computed('rhevSetup', function() {
    return (this.get('rhevSetup') === 'selfhost');
  }),

  actions: {
    rhevSetupChanged() {
      this.get('deploymentController').set('model.rhev_is_self_hosted', this.get('isSelfHosted'));
    }
  }

});
