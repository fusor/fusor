import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ['application'],

  isUpstream: Ember.computed.alias("controllers.application.isUpstream"),

  isOnlyShowSubscriptions: true,

  toggles: function(){ return Ember.A([]); }.property(),

  /* boolean, computed getter and setter */
  allChecked: function(key, value){
    if (arguments.length === 1) {
      var toggles = this.get('toggles');
      return toggles && toggles.isEvery('isChecked');
    } else {
      this.get('toggles').setEach('isChecked', value);
      return value;
    }
  }.property('toggles.@each.isChecked'),

  totalCountSubscriptions: Ember.computed.alias('model.length'),

  allSelectedItems: Ember.computed.filterBy('toggles', 'isChecked', true),
  totalSelectedCount: Ember.computed.alias('allSelectedItems.length'),

  disableNext: true, // CHANGE to true when deploying
  attachingInProgress: false,
  showAttachedSuccessMessage: false,

  prog: 20,
  incrementBy: 20,

  disableAttachButton: function() {
    return (this.get('totalSelectedCount') === 0);
  }.property('totalSelectedCount'),

  actions: {
    registerToggle: function(toggle) {
      this.get('toggles').addObject(toggle);
    },
    deregisterToggle: function(toggle) {
      this.get('toggles').removeObject(toggle);
    },
    attachSubscriptions: function () {
      this.set('attachingInProgress', true);
      this.set('disableAttachButton', true);
      this.send('incrementProgressBar');
    },

    incrementProgressBar: function() {
      var self = this;
      Ember.run.later(function(){
        return self.incrementProperty("prog", self.incrementBy);
      }, 1000);
      Ember.run.later(function(){
        return self.incrementProperty("prog", self.incrementBy);
      }, 2000);
      Ember.run.later(function(){
        return self.incrementProperty("prog", self.incrementBy);
      }, 3000);
      Ember.run.later(function(){
        return self.incrementProperty("prog", self.incrementBy);
      }, 4000);
      Ember.run.later(function(){
        self.set('disableNext', false);
        self.set('disableAttachButton', false);
        self.set('attachingInProgress', false);
        self.set('showAttachedSuccessMessage', true);
      }, 4500);
     },

  },

});
