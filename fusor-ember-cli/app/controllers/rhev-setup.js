import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  rhevIsSelfHosted: Ember.computed.alias("deploymentController.model.rhev_is_self_hosted"),

  rhevSetup: function() {
    return (this.get('rhevIsSelfHosted') ? "selfhost" : "rhevhost");
  }.property('rhevIsSelfHosted'),

  rhevSetupTitle: function() {
    return (this.get('rhevIsSelfHosted') ? "Self Hosted" : "Host + Engine");
  }.property('rhevIsSelfHosted'),

  isSelfHosted: function() {
    return (this.get('rhevSetup') === 'selfhost');
  }.property('rhevSetup'),

  actions: {
    rhevSetupChanged: function() {
      return this.get('deploymentController').set('model.rhev_is_self_hosted', this.get('isSelfHosted'));
    }
  }

});
