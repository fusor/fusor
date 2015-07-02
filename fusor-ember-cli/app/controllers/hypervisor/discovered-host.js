import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ['deployment', 'hypervisor', 'rhev'],

  itemController: ['discovered-host'],

  selectedRhevEngine: Ember.computed.alias("controllers.deployment.discovered_host"),
  rhev_is_self_hosted: Ember.computed.alias("controllers.deployment.rhev_is_self_hosted"),

  isCustomScheme: Ember.computed.alias("controllers.hypervisor.isCustomScheme"),
  isHypervisorN: Ember.computed.alias("controllers.hypervisor.isHypervisorN"),
  custom_preprend_name: Ember.computed.alias("controllers.hypervisor.custom_preprend_name"),
  isFreeform: Ember.computed.alias("controllers.hypervisor.isFreeform"),
  isMac: Ember.computed.alias("controllers.hypervisor.isMac"),

  // Filter out hosts selected as Hypervisor
  availableHosts: Ember.computed.filter('allDiscoveredHosts', function(host, index, array) {
    return (host.get('id') !== this.get('selectedRhevEngine.id'));
  }).property('allDiscoveredHosts', 'selectedRhevEngine'),

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
  }.property('availableHosts', 'searchString'),

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

  idsChecked: function(key){
    var model = this.get('model');
    if (model && model.isAny('isSelectedAsHypervisor')) {
      return this.get('model').getEach("id");
    } else {
      return '';
    }
  }.property('model.@each.isSelectedAsHypervisor'),

  hypervisorBackRouteName: function() {
    if (this.get('rhev_is_self_hosted')) {
      return 'rhev-setup';
    } else {
      return 'engine.discovered-host';
    }
  }.property('rhev_is_self_hosted'),

  actions: {
    refreshModel: function() {
      return this.get('model').reload();
    },

    setCheckAll: function() {
      this.get('model').removeObjects(this.get('availableHosts'));
      return this.get('model').addObjects(this.get('availableHosts'));
    },

    setUncheckAll: function() {
      return this.get('model').removeObjects(this.get('availableHosts'));
    }

  }

});
