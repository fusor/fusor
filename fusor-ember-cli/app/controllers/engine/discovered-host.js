import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment', 'hypervisor/discovered-host'],

  selectedRhevEngineHost: Ember.computed.alias("model"),
  hypervisorModelIds: Ember.computed.alias("controllers.hypervisor/discovered-host.hypervisorModelIds"),
  rhev_is_self_hosted: Ember.computed.alias("controllers.deployment.rhev_is_self_hosted"),

  // Set by route's setupController. Needed since hypervisorModelIds is
  // only available after route hypervisor/discovered hosts is activated
  selectedHypervisors: [],
  allDiscoveredHosts: [],

  engineNextRouteName: function() {
    if (this.get('rhev_is_self_hosted')) {
      return 'rhev-options';
    } else {
      return 'hypervisor.discovered-host';
    }
  }.property('rhev_is_self_hosted'),

  // Filter out hosts selected as Hypervisor
  availableHosts: Ember.computed.filter('allDiscoveredHosts', function(item, index, array) {
    var hypervisorsIds = (this.get('selectedHypervisors').getEach('id'));
    console.log(hypervisorsIds);
    return !(hypervisorsIds.contains(item.get('id')));
  }).property('selectedHypervisors', 'allDiscoveredHosts'),

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

  numSelected: function() {
    return (this.get('model.id')) ? 1 : 0;
  }.property('model'),

});
