import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ['deployment', 'hypervisor', 'rhev'],

  selectedRhevEngine: Ember.computed.alias("controllers.deployment.model.discovered_host"),
  rhevIsSelfHosted: Ember.computed.alias("controllers.deployment.model.rhev_is_self_hosted"),

  isCustomScheme: Ember.computed.alias("controllers.hypervisor.isCustomScheme"),
  isHypervisorN: Ember.computed.alias("controllers.hypervisor.isHypervisorN"),
  customPreprendName: Ember.computed.alias("controllers.hypervisor.model.custom_preprend_name"),
  isFreeform: Ember.computed.alias("controllers.hypervisor.isFreeform"),
  isMac: Ember.computed.alias("controllers.hypervisor.isMac"),

  // Filter out hosts selected as Engine
  availableHosts: function() {
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
  }.property('allDiscoveredHosts.[]', 'hypervisorModelIds.[]'),

  filteredHosts: function(){
    var searchString = this.get('searchString');
    var rx = new RegExp(searchString, 'gi');
    var model = this.get('availableHosts');

    if (model.get('length') > 0) {
      return model.filter(function(record) {
        return (record.get('name').match(rx) || record.get('memory_human_size').match(rx) ||
                record.get('disks_human_size').match(rx) || record.get('subnet_to_s').match(rx) ||
                record.get('mac').match(rx)
               );
      });
    } else {
      return model;
    }
  }.property('availableHosts.[]', 'searchString'),

  hypervisorModelIds: function() {
    if (this.get('model')) {
      var allIds = this.get('model').getEach('id');
      return allIds.removeObject(this.get('selectedRhevEngine').get('id'));
    } else {
      return [];
    }
  }.property('model.[]', 'selectedRhevEngine'),

  cntSelectedHypervisorHosts: Ember.computed.alias('hypervisorModelIds.length'),

  hostInflection: function() {
      return this.get('cntSelectedHypervisorHosts') === 1 ? 'host' : 'hosts';
  }.property('cntSelectedHypervisorHosts'),

  isAllChecked: function() {
    return (this.get('cntSelectedHypervisorHosts') === this.get('availableHosts.length'));
  }.property('availableHosts.@each', 'cntSelectedHypervisorHosts'),

  observeAllChecked: function(row) {
    // TODO
    if (this.get('allChecked')) {
      return this.send('setCheckAll');
    } else {
      return this.send('setUncheckAll');
    }
  }.observes('allChecked'),

  hypervisorBackRouteName: function() {
    if (this.get('rhevIsSelfHosted')) {
      return 'rhev-setup';
    } else {
      return 'engine.discovered-host';
    }
  }.property('rhevIsSelfHosted'),

  actions: {

    setCheckAll: function() {
      this.get('model').setObjects([]);
      return this.get('model').addObjects(this.get('availableHosts'));
    },

    setUncheckAll: function() {
      this.get('model').setObjects([]);
    }

  }

});
