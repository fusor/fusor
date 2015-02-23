import Ember from 'ember';

export default Ember.ArrayController.extend({

  // isSelected: Em.computed.alias('isSelectedAsEngine'),

  // Filter out hosts already selected as Hypervisor, since we are NOT in self-hosted
  availableHosts: Em.computed.filterBy('model', 'isSelectedAsHypervisor', false),

  selectedHosts: Ember.computed.filter('model', function(host, index, array) {
    return (host.get('id') == this.get('engineIdSelected'));
  }).property('model', 'engineIdSelected'),

  // TODO Why didn't this work???
  // selectedHosts: function() {
  //   return this.filter(function(item, index, enumerable){
  //     return (item.isSelectedAsEngine);
  //   });
  // }.property('model.@each.isSelectedAsEngine')

  engineIdSelected: 0,

  cntSelectedHosts: function () {
    return ((this.get('engineIdSelected') > 0) ? 1 : 0);
  }.property('engineIdSelected'),



});
