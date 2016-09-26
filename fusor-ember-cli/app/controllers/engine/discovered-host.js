import Ember from 'ember';

import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";
import PaginationControllerMixin from "../../mixins/pagination-controller-mixin";
import FilterSortHostsMixin from "../../mixins/filter-sort-hosts-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, PaginationControllerMixin, FilterSortHostsMixin, {

  sortRoute: "engine.discovered-host",

  rhevController: Ember.inject.controller('rhev'),

  selectedRhevEngineHost: Ember.computed.alias("model"),

  hypervisorModelIds: Ember.computed('deploymentController.model.discovered_hosts.[]', function() {
    return this.get('deploymentController.model.discovered_hosts').getEach('id');
  }),

  engineNextRouteName: Ember.computed('rhevIsSelfHosted', function() {
    if (this.get('rhevIsSelfHosted')) {
      return 'rhev-options';
    } else {
      return 'hypervisor.discovered-host';
    }
  }),

  // Filter out hosts selected as Hypervisor
  availableHosts: Ember.computed('deployingHosts', 'allDiscoveredHosts.[]', 'hypervisorModelIds.[]', function() {
    let allDiscoveredHosts = this.get('allDiscoveredHosts');

    if (Ember.isEmpty(allDiscoveredHosts)) {
      return [];
    }

    let deployingHosts = this.get('deployingHosts');

    return allDiscoveredHosts.filter(host => {
      let hostId = host.get('id');
      let isDeploying = deployingHosts.any(deployingHost => deployingHost.get('id') === hostId);

      return !isDeploying;
    });
  }),

  numSelected: Ember.computed('model.id', function() {
    return (this.get('model.id')) ? 1 : 0;
  }),

  isSelectedEngineHostnameInvalid: false,

  disableNextOnEngine: Ember.computed(
    'isSelectedEngineHostnameInvalid',
    'deploymentController.hasNoEngine',
    function() {
      return this.get('deploymentController.hasNoEngine') ||
        this.get('isSelectedEngineHostnameInvalid');
    }
  ),

  actions: {
    onEngineChanged(newlySelectedHost, isInvalidHostname) {
      this.set('isSelectedEngineHostnameInvalid', isInvalidHostname);
      this.set('deploymentController.model.discovered_host', newlySelectedHost);
    },
    setIfHostnameInvalid(bool, hostId) {
      let discoveredHost = this.get('deploymentController.model.discovered_host');
      if(discoveredHost && discoveredHost.get('id') === hostId) {
        this.set('isSelectedEngineHostnameInvalid', bool);
      }
    }
  }
});
