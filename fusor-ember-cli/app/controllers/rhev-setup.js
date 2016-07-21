import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";
import NeedsDiscoveredHostsAjax from '../mixins/needs-discovered-hosts-ajax';

export default Ember.Controller.extend(NeedsDeploymentMixin, NeedsDiscoveredHostsAjax, {

  rhevIsSelfHosted: Ember.computed.alias("deploymentController.model.rhev_is_self_hosted"),

  setupNextRouteName: Ember.computed('rhevIsSelfHosted', function(){
    if (this.get('rhevIsSelfHosted')) {
      return 'hypervisor.discovered-host';
    } else {
      return 'engine.discovered-host';
    }
  }),

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
      this.get('deploymentController').set(
        'model.rhev_is_self_hosted',
        this.get('isSelfHosted')
      );

      // Changing from self-hosted to hv+engine setup needs to reset
      // host associations to a clean slate.
      this.resetEngineAndHypervisors().catch(err => {
        console.log('Error occurred while resetting engine and hypervisors');
        console.log(err);
      });
    }
  },

  resetEngineAndHypervisors() {
    const deployment = this.get('deploymentController.model');

    deployment.set('discovered_host', null); // Engine reset
    return deployment
      .save()
      .then(() => this.postDiscoveredHostIds(deployment, []))
      .then(() => this.send('loadDefaultData', deployment, {reset: true}));
  }
});
