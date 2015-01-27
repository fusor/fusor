import Ember from 'ember';

export default Ember.ArrayController.extend({

  selectedHosts: Em.computed.filterBy('model', 'isSelectedAsHypervisor', true),

  // TODO Why didn't this work???
  // selectedHosts: function() {
  //   return this.filter(function(item, index, enumerable){
  //     return (item.isSelectedAsHypervisor);
  //   });
  // }.property('model.@each.isSelectedAsHypervisor')

  cntSelectedHosts: Em.computed.alias('selectedHosts.length'),

  // hypervisorHostId: function() {
  //   return this.get('selectedHosts.length');
  // }.property('selectedHosts'),


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
      return model && model.isEvery('isSelectedAsHypervisor');
    } else {
      this.get('model').setEach('isSelectedAsHypervisor', value);
      return value;
    }
  }.property('model.@each.isSelectedAsHypervisor'),

  idChecked: function(key){
    var model = this.get('model');
    if (model && model.isAny('isSelectedAsHypervisor')) {
      return 'yes'; //this.//   return model && model.isEvery('isSelectedAsHypervisor');
    } else {
      return 'none';
    }
    // } else {
    //   this.get('model').setEach('isSelectedAsHypervisor', value);
    //   return value;
    // }
  }.property('model.@each.isSelectedAsHypervisor'),

});
