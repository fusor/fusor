import Ember from 'ember';
import NeedsDeploymentMixin from "../mixins/needs-deployment-mixin";
import NeedsDiscoveredHostsAjax from '../mixins/needs-discovered-hosts-ajax';

export default Ember.Controller.extend(NeedsDeploymentMixin, NeedsDiscoveredHostsAjax, {

  setupNextRouteName: Ember.computed('rhevIsSelfHosted', function(){
    return this.get('rhevIsSelfHosted') ?
      'hypervisor.discovered-host' : 'engine.discovered-host';
  }),

  rhevSetupTitle: Ember.computed('rhevIsSelfHosted', function() {
    return (this.get('rhevIsSelfHosted') ? "Self Hosted" : "Host + Engine");
  }),

  actions: {
    rhevSetupChanged(newSelection) {
      this.get('deploymentController').set(
        'model.rhev_is_self_hosted',
        newSelection === 'selfhost'
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
    // Datacenter and cluster can only be Default/Default for self-hosted
    deployment.set('rhev_data_center_name', 'Default');
    deployment.set('rhev_cluster_name', 'Default');
    return deployment
      .save()
      .then(() => this.postDiscoveredHostIds(deployment, []))
      .then(() => this.send('loadDefaultData', deployment, {reset: true}));
  }
});
