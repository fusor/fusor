import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  hypervisorController: Ember.inject.controller('hypervisor'),
  // todo - delete rhevcontroller - not used?
  // rhevController: Ember.inject.controller('rhev'),

  selectedRhevEngine: Ember.computed.alias("deploymentController.model.discovered_host"),
  rhevIsSelfHosted: Ember.computed.alias("deploymentController.model.rhev_is_self_hosted"),
  isStarted: Ember.computed.alias("deploymentController.isStarted"),
  isNotStarted: Ember.computed.alias("deploymentController.isNotStarted"),

  isCustomScheme: Ember.computed.alias("hypervisorController.isCustomScheme"),
  isHypervisorN: Ember.computed.alias("hypervisorController.isHypervisorN"),
  customPreprendName: Ember.computed.alias("hypervisorController.model.custom_preprend_name"),
  isFreeform: Ember.computed.alias("hypervisorController.isFreeform"),
  isMac: Ember.computed.alias("hypervisorController.isMac"),

  // Filter out hosts selected as Engine
  availableHosts: Ember.computed('allDiscoveredHosts.[]', 'hypervisorModelIds.[]', function() {
    // TODO: Ember.computed.filter() caused problems. error item.get is not a function
    var self = this;
     var allDiscoveredHosts = this.get('allDiscoveredHosts');
     if (this.get('allDiscoveredHosts')) {
        return allDiscoveredHosts.filter(function(item) {
          if (self.get('hypervisorModelIds')) {
            //console.log(item.get('id'));
            //console.log(self.get('hypervisorModelIds'));
            return (item.get('id') !== self.get('selectedRhevEngine.id'));
          }
        });
      }
  }),

  // same as Engine. TODO. put it mixin
  filteredHosts: Ember.computed('availableHosts.[]', 'searchString', 'isStarted', function(){
    var searchString = this.get('searchString');
    var rx = new RegExp(searchString, 'gi');
    var availableHosts = this.get('availableHosts');

    if (this.get('isStarted')) {
      return this.get('model');
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

  hypervisorModelIds: Ember.computed('model.[]', 'selectedRhevEngine', function() {
    if (this.get('model')) {
      var allIds = this.get('model').getEach('id');
      return allIds.removeObject(this.get('selectedRhevEngine').get('id'));
    } else {
      return [];
    }
  }),

  cntSelectedHypervisorHosts: Ember.computed.alias('hypervisorModelIds.length'),

  hostInflection: Ember.computed('cntSelectedHypervisorHosts', function() {
      return this.get('cntSelectedHypervisorHosts') === 1 ? 'host' : 'hosts';
  }),

  isAllChecked: Ember.computed('availableHosts.@each', 'cntSelectedHypervisorHosts', function() {
    return (this.get('cntSelectedHypervisorHosts') === this.get('availableHosts.length'));
  }),

  observeAllChecked: Ember.observer('allChecked', function(row) {
    // TODO
    if (this.get('allChecked')) {
      return this.send('setCheckAll');
    } else {
      return this.send('setUncheckAll');
    }
  }),

  hypervisorBackRouteName: Ember.computed('rhevIsSelfHosted', function() {
    if (this.get('rhevIsSelfHosted')) {
      return 'rhev-setup';
    } else {
      return 'engine.discovered-host';
    }
  }),

  actions: {

    setCheckAll() {
      this.get('model').setObjects([]);
      return this.get('model').addObjects(this.get('availableHosts'));
    },

    setUncheckAll() {
      this.get('model').setObjects([]);
    }

  }

});
