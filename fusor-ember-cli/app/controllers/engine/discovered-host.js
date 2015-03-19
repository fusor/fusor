import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment', 'hypervisor/discovered-host'],

  selectedRhevEngineHost: Ember.computed.alias("model"),
  hypervisorModelIds: Ember.computed.alias("controllers.hypervisor/discovered-host.hypervisorModelIds"),

  // Set by route's setupController. Needed since hypervisorModelIds is
  // only available after route hypervisor/discovered hosts is activated
  selectedHypervisors: [],
  allDiscoveredHosts: [],

  // Filter out hosts selected as Hypervisor
  availableHosts: Ember.computed.filter('allDiscoveredHosts', function(item, index, array) {
    var hypervisorsIds = (this.get('selectedHypervisors').getEach('id'));
    console.log(hypervisorsIds);
    return !(hypervisorsIds.contains(item.get('id')));
  }).property('selectedHypervisors', 'allDiscoveredHosts'),

});
