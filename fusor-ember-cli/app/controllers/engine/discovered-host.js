import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['deployment', 'hypervisor/discovered-host'],

  selectedRhevEngineHost: Ember.computed.alias("model"),

  // Filter out hosts selected as Hypervisor
  availableHosts: Ember.computed.filter('allDiscoveredHosts', function(host, index, array) {
    return (host.get('id') != 'TODO aray of host ids');
  }).property('allDiscoveredHosts'),

});
