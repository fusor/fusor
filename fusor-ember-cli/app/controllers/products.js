import Ember from 'ember';

export default Ember.ArrayController.extend({

  syncingInProgress: false,
  showSuccessMessage: false,
  disableSyncButton: false,

  prog: 20,
  incrementBy: 20,

  actions: {
    syncProducts: function () {
      this.set('syncingInProgress', true);
      this.set('disableSyncButton', true);
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
        self.set('syncingInProgress', false);
        self.set('showSuccessMessage', true);
      }, 4500);
     }

  },


});
