import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  rhevController: Ember.inject.controller('rhev'),

  selectedRhevEngineHost: Ember.computed.alias("model"),
  rhevIsSelfHosted: Ember.computed.alias("deploymentController.model.rhev_is_self_hosted"),

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
  availableHosts: Ember.computed('allDiscoveredHosts.[]', 'hypervisorModelIds.[]', function() {
    // TODO: Ember.computed.filter() caused problems. error item.get is not a function
    var self = this;
    var allDiscoveredHosts = this.get('allDiscoveredHosts');
    if (this.get('allDiscoveredHosts')) {
      return allDiscoveredHosts.filter(function(item) {
        if (self.get('hypervisorModelIds')) {
          return !(self.get('hypervisorModelIds').contains(item.get('id')));
        }
      });
    }
  }),

  filteredHosts: Ember.computed('availableHosts.[]', 'searchString', 'isStarted', function(){
    var searchString = this.get('searchString');
    var rx = new RegExp(searchString, 'gi');
    var availableHosts = this.get('availableHosts');

    if (this.get('isStarted')) {
      return Ember.A([this.get('model')]);
    } else if (availableHosts.get('length') > 0) {
      return availableHosts.filter(function(record) {
        return (record.get('name').match(rx) || record.get('memory_human_size').match(rx) ||
                record.get('disks_human_size').match(rx) || record.get('subnet_to_s').match(rx) ||
                record.get('mac').match(rx)
               );
      });
    } else {
      return availableHosts;
    }
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
