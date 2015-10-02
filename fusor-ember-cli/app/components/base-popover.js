import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function(){
      return Ember.$('[data-toggle=popover]').popover();
  }
});
