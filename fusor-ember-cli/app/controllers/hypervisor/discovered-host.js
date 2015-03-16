import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['deployment'],

  //discovered_hosts: Ember.computed.alias("controllers.deployment.discovered_hosts"),

  selectedRhevEngine: Ember.computed.alias("controllers.deployment.discovered_host"),

  // Filter out hosts selected as Hypervisor
  availableHosts: Ember.computed.filter('allDiscoveredHosts', function(host, index, array) {
    return (host.get('id') != this.get('selectedRhevEngine.id'));
  }).property('allDiscoveredHosts', 'selectedRhevEngine'),

  selectedHosts: Em.computed.filterBy('model', 'isSelectedAsHypervisor', true),

  modelIds: function() {
    return this.get('model').getEach('id');
  }.property('model'),

  cntSelectedHosts: Em.computed.alias('selectedHosts.length'),

  hostInflection: function() {
    return this.get('cntSelectedHosts') === 1 ? 'host' : 'hosts';
  }.property('cntSelectedHosts'),

  allChecked: function(key, value){
    if (arguments.length === 1) {
      var model = this.get('model');
      return model && model.isEvery('isSelectedAsHypervisor');
    } else {
      this.get('model').setEach('isSelectedAsHypervisor', value);
      return value;
    }
  }.property('model.@each.isSelectedAsHypervisor'),

  idsChecked: function(key){
    var model = this.get('model');
    if (model && model.isAny('isSelectedAsHypervisor')) {
      return this.get('selectedHosts').getEach("id"); //this.//   return model && model.isEvery('isSelectedAsHypervisor');
    } else {
      return '';
    }
  }.property('model.@each.isSelectedAsHypervisor', 'selectedHosts'),

});
