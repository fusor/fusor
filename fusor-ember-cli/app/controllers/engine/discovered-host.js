import Ember from 'ember';

export default Ember.ArrayController.extend({

//  isSelected: Em.computed.alias('isSelectedAsEngine'),

  // Filter out hosts already selected as Hypervisor, since we are NOT in self-hosted
  avialableHosts: Em.computed.filterBy('model', 'isSelectedAsHypervisor', false),

  selectedHosts: Em.computed.filterBy('model', 'isSelectedAsEngine', true),

  // TODO Why didn't this work???
  // selectedHosts: function() {
  //   return this.filter(function(item, index, enumerable){
  //     return (item.isSelectedAsEngine);
  //   });
  // }.property('model.@each.isSelectedAsEngine')

  cntSelectedHosts: Em.computed.alias('selectedHosts.length'),

  // TODO Why didn't this work???
  // numSelectedHosts: function() {
  //   return this.get('selectedHosts').get('length');
  // }.property('selectedHosts'),

  hostInflection: function() {
    return this.get('cntSelectedHosts') === 1 ? 'host' : 'hosts';
  }.property('cntSelectedHosts'),

  allChecked: function(key, value){
    if (arguments.length === 1) {
      var model = this.get('model');
      return model && model.isEvery('isSelectedAsEngine');
    } else {
      this.get('model').setEach('isSelectedAsEngine', value);
      return value;
    }
  }.property('model.@each.isSelectedAsEngine'),


});
