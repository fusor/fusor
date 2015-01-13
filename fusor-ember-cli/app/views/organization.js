import Ember from 'ember';

export default Ember.View.extend({
  classNameBindings: ['color'],
  color: null,
  highlight: function() {
    return this.get('color');
  },

  // mouseEnter: function(event) {
  //   this.set('color', 'yellow');
  // },

  // mouseLeave: function(event) {
  //   this.set('color', 'green');
  //   //alert("mouseLeave!");
  // },
  doubleClick: function(event) {
    this.set('color', 'red');
    //alert("ClickableView was clicked!");
  },
});
