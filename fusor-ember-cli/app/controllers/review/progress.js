import Ember from 'ember';

export default Ember.Controller.extend({

  installationInProgress: true,

  prog: 1,

  incrementBy: 20,

  // actions: {
  //   registerToggle: function(toggle) {
  //     this.get('toggles').addObject(toggle);
  //   },
  //   deregisterToggle: function(toggle) {
  //     this.get('toggles').removeObject(toggle);
  //   },
  //   attachSubscriptions: function () {
  //     this.set('attachingInProgress', true);
  //     this.set('disableAttachButton', true);
  //     this.send('incrementProgressBar');
  //   },

  //   incrementProgressBar: function() {
  //     var self = this;
  //     Ember.run.later(function(){
  //       return self.incrementProperty("prog", self.incrementBy);
  //     }, 1000);
  //     Ember.run.later(function(){
  //       return self.incrementProperty("prog", self.incrementBy);
  //     }, 2000);
  //     Ember.run.later(function(){
  //       return self.incrementProperty("prog", self.incrementBy);
  //     }, 3000);
  //     Ember.run.later(function(){
  //       return self.incrementProperty("prog", self.incrementBy);
  //     }, 4000);
  //     Ember.run.later(function(){
  //       self.set('disableNext', false);
  //       self.set('disableAttachButton', false);
  //       self.set('attachingInProgress', false);
  //       self.set('showAttachedSuccessMessage', true);
  //     }, 4500);
  //    },

  //},

});
