import Ember from 'ember';

export default Ember.Component.extend({
  dataToggleId: 'popover',
  didInsertElement: function(){
    PatternFly.popovers('[data-toggle=' + this.get('dataToggleId') + ']');
  }
});
