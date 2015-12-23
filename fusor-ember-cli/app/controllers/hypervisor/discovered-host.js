import Ember from 'ember';
import NeedsDeploymentMixin from "../../mixins/needs-deployment-mixin";

export default Ember.Controller.extend(NeedsDeploymentMixin, {

  selectedRhevEngine: Ember.computed.alias("deploymentController.model.discovered_host"),
  rhevIsSelfHosted: Ember.computed.alias("deploymentController.model.rhev_is_self_hosted"),

  hostNamingScheme: Ember.computed.alias("deploymentController.model.host_naming_scheme"),
  customPreprendName: Ember.computed.alias("deploymentController.model.custom_preprend_name"),

  namingOptions: ['Freeform', 'MAC address', 'hypervisorN', 'Custom scheme'],

  isFreeform: Ember.computed('hostNamingScheme', function() {
    return (this.get('hostNamingScheme') === 'Freeform');
  }),

  isMac: Ember.computed('hostNamingScheme', function() {
    return (this.get('hostNamingScheme') === 'MAC address');
  }),

  isCustomScheme: Ember.computed('hostNamingScheme', function() {
    return (this.get('hostNamingScheme') === 'Custom scheme');
  }),

  isHypervisorN: Ember.computed('hostNamingScheme', function() {
    return (this.get('hostNamingScheme') === 'hypervisorN');
  }),

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

  isAllChecked: Ember.computed('availableHosts.[]', 'cntSelectedHypervisorHosts', function() {
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

  isHostnameInvalid: false, //can overwritten by action setToInvalidHostname() triggered from tr-engine-hypervisor-mixin.js
  disableNextOnHypervisor: Ember.computed('isHostnameInvalid', 'rhevController.hasNoHypervisor', function() {
    return (this.get('isHostnameInvalid') || this.get('rhevController.hasNoHypervisor'));
  }),

  actions: {

    setCheckAll() {
      this.get('model').setObjects([]);
      this.set('checkAll', true);
      this.set('uncheckAll', false);
      return this.get('model').addObjects(this.get('availableHosts'));
    },

    setUncheckAll() {
      this.set('uncheckAll', true);
      this.set('checkAll', false);
      this.get('model').setObjects([]);
    },

    openNamingSchemeModal() {
      this.set('isOpenNamingSchemeModal', true);
    },

    cancelNamingScheme() {
      this.set('isCloseNamingSchemeModal', true);
      this.get('deploymentController.model').rollback();
    },

    saveNamingScheme() {
      this.set('isCloseNamingSchemeModal', true);
      this.get('deploymentController.model').save();
    },

    setIfHostnameValid(bool) {
      this.set('isHostnameInvalid', bool);
    }

  }

});
