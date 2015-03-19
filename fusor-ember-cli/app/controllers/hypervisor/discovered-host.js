import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ['deployment'],

  itemController: ['discovered-host'],

  selectedRhevEngine: Ember.computed.alias("controllers.deployment.discovered_host"),

  // Filter out hosts selected as Hypervisor
  availableHosts: Ember.computed.filter('allDiscoveredHosts', function(host, index, array) {
    return (host.get('id') != this.get('selectedRhevEngine.id'));
  }).property('allDiscoveredHosts', 'selectedRhevEngine'),

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

  isAllChecked: function(key, value) {
      if (this.get('cntSelectedHypervisorHosts') === this.get('availableHosts.length')) {
        return this.set('allChecked', true);
      } else {
        return this.set('allChecked', false);
      }
  }.property('availableHosts.@each.isSelectedAsHypervisor', 'cntSelectedHypervisorHosts'),

  allChecked: function(key, value){
    // get
    if (arguments.length === 1) {
      var availableHosts = this.get('availableHosts');
      var isAllChecked = (this.get('model.length') === this.get('availableHosts.length'));
      return (availableHosts && isAllChecked);
    // setter
    } else {
      // TODO - this is running when each host is individually checked as well????
      // Problem because isSelectedAsHypervisor is on the itemController and not model ???
      // console.log('setter only');
    }
  }.property('model.@each.isSelectedAsHypervisor', 'model.[]', 'availableHosts'),

  checkAll: function(row) {
    // TODO
    if (this.get('allChecked')) {
      // var hosts = this.get('model');
      // hosts.clear();
      // hosts.addObjects(this.get('availableHosts'));
      // return true;
      console.log('all checked true');
    } else {
      // var hosts = this.get('model');
      // return hosts.clear();
      // return false;
      console.log('all checked FALSE');
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

});
